import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
    uri: 'http://localhost:3000/graphql'
})

export const apolloProvider = new VueApollo({
    defaultClient: new ApolloClient({
        uri: 'http://localhost:3000/graphql'
    })
})
