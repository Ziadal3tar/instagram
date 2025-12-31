
import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input('appLazyLoad') src!: string; // المصدر (صورة أو رابط فيديو أو رابط خلفية)
  @Input() background: boolean = false; // true => تعيين background-image
  @Input() isVideo: boolean = false; // true => العنصر هو <video>
  @Input() rootMargin: string = '200px'; // متى نبدأ التحميل قبل الظهور
  @Input() poster?: string; // فيديو: صورة عرض قبل التشغيل

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.src) {
      return;
    }

    // if browser supports native lazy for images, we prefer simple attr for <img>
    const nativeLazy = 'loading' in HTMLImageElement.prototype;

    const element = this.el.nativeElement as HTMLElement;

    // If it's an <img> and browser supports native lazy attribute — use it
    if (!this.isVideo && !this.background && element.tagName === 'IMG' && nativeLazy) {
      this.renderer.setAttribute(element, 'loading', 'lazy');
      this.renderer.setAttribute(element, 'src', this.src);
      return;
    }

    // Fallback: use IntersectionObserver
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.load();
            this.unobserve();
          }
        });
      }, { root: null, rootMargin: this.rootMargin, threshold: 0.01 });

      this.observer.observe(element);
    } else {
      // No IntersectionObserver -> load immediately
      this.load();
    }
  }

  private load() {
    const element = this.el.nativeElement as HTMLElement;

    if (this.background) {
      // set background-image
      this.renderer.setStyle(element, 'background-image', `url('${this.src}')`);
      // optionally add a loaded class
      this.renderer.addClass(element, 'lazy-loaded');
      return;
    }

    if (this.isVideo && element.tagName === 'VIDEO') {
      const video = element as HTMLVideoElement;
      // set poster if provided
      if (this.poster) {
        this.renderer.setAttribute(video, 'poster', this.poster);
      }

      // find existing <source> or create one
      let source = video.querySelector('source') as HTMLSourceElement | null;
      if (!source) {
        source = this.renderer.createElement('source') as HTMLSourceElement;
        this.renderer.appendChild(video, source);
      }
      this.renderer.setAttribute(source, 'src', this.src);
      // If type known you can also set type attribute: source.type = 'video/mp4'
      // Call load to start reading the new source when playback requested
      try {
        video.load();
      } catch (e) {
        // ignore
      }
      this.renderer.addClass(video, 'lazy-loaded');
      return;
    }

    // Default: treat as <img> or generic element with src attribute
    if (element.tagName === 'IMG') {
      this.renderer.setAttribute(element, 'src', this.src);
      this.renderer.addClass(element, 'lazy-loaded');
    } else {
      // For any other tag, set background-image as fallback
      this.renderer.setStyle(element, 'background-image', `url('${this.src}')`);
      this.renderer.addClass(element, 'lazy-loaded');
    }
  }

  private unobserve() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.unobserve();
  }
}
