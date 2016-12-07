import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import useRelay from 'react-router-relay';
import { applyRouterMiddleware, Route, Router } from 'react-router';
import browserHistory from 'react-router/lib/browserHistory';

const environment = new Relay.Environment();
environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));

const root = document.getElementById('root');

const URLRequired = Relay.createContainer(({ item }) => <pre>{item.url}</pre>, {
  fragments: {
    item: () => Relay.QL`
      fragment on URLRequired {
        url
      }
    `,
  },
});

const URLNotRequired = Relay.createContainer(({ item }) => <pre>{item.notRequiredUrl}</pre>, {
  fragments: {
    item: () => Relay.QL`
      fragment on URLNotRequired {
        notRequiredUrl: url
      }
    `,
  },
});

const componentMapping = {
  // __typename: Component
  'URLRequired': URLRequired,
  'URLNotRequired': URLNotRequired,
};

const Home = Relay.createContainer(({ home }) => (
  <section>
    {home.content.map((content) => {
      const ContentComponent = componentMapping[content.__typename];
      if (!ContentComponent) return null;
      return <ContentComponent item={content} />
    })}
  </section>
), {
  fragments: {
    home: () => Relay.QL`
      fragment on Home {
        content {
          __typename
          ${URLRequired.getFragment('item')}
          ${URLNotRequired.getFragment('item')}
        }
      }
    `,
  },
});

ReactDOM.render(
  <Router
    history={browserHistory}
    // hack to get this example working
    // see https://github.com/relay-tools/react-router-relay/issues/192
    render={applyRouterMiddleware(useRelay.default || useRelay)}
    environment={environment}
  >
    <Route
      path="/"
      component={Home}
      queries={{ home: () => Relay.QL`query { home }` }}
    />
  </Router>,
  root
);
