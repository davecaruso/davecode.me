import { Provider, signIn, useSession } from 'next-auth/client'
import { useEffect } from 'react';
import '../style/_global.scss';

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  )
}

function Auth({ children }) {
  const [session, loading] = useSession()
  const isUser = !!session?.user
  useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, loading])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (<div className="authLoader">
            <h1>Loading...</h1>
          </div>)
}