export default {
  Query: {
    login() {
      return {
        accessToken: 'any_token',
        account: {
          id: 'any_id',
          name: 'any_name'
        }
      }
    }
  }
}