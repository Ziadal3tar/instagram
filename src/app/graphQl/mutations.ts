import { gql } from 'apollo-angular';
const signUp = gql`
   mutation signUp($email: String!, $password: String!, $fullName: String!, $userName: String!) {
     signUp(email: $email, password: $password, fullName: $fullName, userName: $userName)
   }
`;
const signIn = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      message
      id
      token
    }
  }
`;
export {signUp,signIn}
// {
//   message
//   token
//   id
// }
