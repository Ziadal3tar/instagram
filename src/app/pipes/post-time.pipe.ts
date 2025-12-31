import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postTime'
})
export class PostTimePipe implements PipeTransform {

  transform(time: unknown|any, ...args: unknown[]): unknown {
    var currentTime = Date.now();
    const date1 = new Date(time);

    // Second date
    const date2 = new Date(currentTime);

    // Calculating the time difference in milliseconds
    const timeDifferenceInMilliseconds = date2.getTime() - date1.getTime();

    const daysDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if(daysDifference == 0 && hoursDifference == 0){
      return `${minutesDifference}m`

    }else if(daysDifference == 0 && hoursDifference != 0){
      return `${hoursDifference}h ${minutesDifference}m`
    }else{
      return `${daysDifference}d ${hoursDifference}h`

    }

  }

}
