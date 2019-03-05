# Using React Hooks to Abstract Over Legacy Systems

## Problem Set Up

Given an object that looks like this:

```js
const todo = {
  id: 1,
  name: "Get milk",
  owner_ids: [1, 2, 3]
};
```

Which relates to models like this:

```js
const userOne = {
  id: 1,
  name: "Eli",
  avatar: {
    small: "https://smolavatars.com/1",
    small: "https://bigavatars.com/1"
  }
};

const userTwo = {
  id: 2,
  name: "Ben",
  avatar: {
    small: "https://smolavatars.com/2",
    small: "https://bigavatars.com/2"
  }
};
```

Say we want to create component that looks like this:

```js
const Todo = ({ name, avatarUrls }) => (
  <div>
    {name}
    <div>
      {avatarUrls.map(src => (
        <img src={src} />
      ))}
    </div>
  </div>
);
```

but connect it to our legacy data store framework where lookups are by IDs, to get updates to our models:

```js
class ModelStore {
  constructor(allModels) {
    this.all = allModels.reduce(
      (acc, next) => ({
        ...acc,
        [next.id]: next,
      }),
      {}
    );
  }

  getById = id => this.all[id];

  // Where updates are triggered by an callback/subscription pattern:
  subscribers = {};
  subscribe = (id, callback) => {
    if (this.subscribers[id] != null) {
      this.subscribers[id].push(callback);
    } else {
      this.subscribers[id] = [callback];
    }

    const unsubscribe = () => {
      this.subscribers[id] = this.subscribers[id].filter(
        subscriber => subscriber === callback
      );
    };

    return unsubscribe;
  };

  updateById = (id, updatedModel) => {
    this.all[id] = updatedModel;
    const subscribers = this.subscribers[id];
    if (subscribers != null) {
      subscribers.forEach(subscriber => {
        subscriber(updatedModel);
      });
    }
  };
}

const TodoModelStore = new ModelStore([todo]);
const UserModelStore = new ModelStore([userOne, userTwo]);
```

This entire model system is completely contrived, but I'm sure we've all seen systems that looks something like this.
i.e. Redux (and normalizr-like impls with selectors), many client-side databases, etc.

How can we create a system that uses our legacy datastore, but sets us up in a way to colocate our view's data requirements with the component that renders the view?
Not GraphQL... React Hooks!

## Hook To The Rescue

What does a hook-ified version of this end up looking like?

Here's a simplistic implementation using `useState`.

```js
const useTodo = id => {
  const [todo, setTodo] = useState(TodoModelStore.getById(id));
  React.useEffect(() => {
    const unsubscribe = TodoModelStore.subscribe(id, model => {
      setTodo(model);
    });
    return unsubscribe;
  });
  return todo;
};
```

This is great, because now we can create a todo that updates itself!

```js
const ConnectedTodo = ({ id }) => {
  const todo = useTodo(id);
  let avatarUrls; // oh no. what goes here though? We didn't subscribe to our users.

  // Again, naively, we could write this by reaching into our legacy store:
  avatarUrls = todo.owner_ids.map(id => {
    const user = UserModelStore.getById(id);
    return user.avatar.small;
  });

  return <Todo name={todo.name} avatarUrls={avatarUrls} />;
};
```

How do we subscribe to the avatar URLs in a nested way, such that we can listen to when
the `todo` updates, but also connect them to our `UserModelStore`?

One method could be to break out the avatar into its own component, and pass along user IDs.
To do this, let's generalize our hook to take any `ModelStore`, instead of just `TodoModelStore`:

```js
const useModel = (Model, id) => {
  const [model, setModel] = useState(Model.getById(id));
  React.useEffect(() => {
    const unsubscribe = Model.subscribe(id, model => {
      setModel(model);
    });
    return unsubscribe;
  });
  return model;
}
```

The contents of that hook are nearly the same as `useTodo`. The biggest difference is that we've now dependency-injected the `Model`, so that we can subscribe to _any_ `ModelStore`.

So let's try to subscribe to our users now:

```js
const Todo = ({ id }) = {
  const todo = useModel(TodoModelStore, id);
  const users = todo.owner_ids.map(userId => useModel(UserModelStore, userId)) // wait a minute
  
  // we actually can't write this implementation (using `map`) because the Rules of Hooks™ state:
  // "Don’t call Hooks inside loops, conditions, or nested functions": https://reactjs.org/docs/hooks-rules.html

  return (
    ... 
  )
};
```

So how do we write hooks that need nested hook?

What do we know we can nest in React?

We can definitely nest React.Components, that's for sure.

How does that help us here? Well, in our case, we could hookify an `Avatar` component to subscribe for updates to users:

Let's try to hookify our avatar now:

```js
const Avatar = ({ userId }) => {
  const user = useModel(UserModelStore, userId);
  return (
    <img src={user.avatar.small} />
  );
);

const Todo = ({ id }) => {
  const todo = useModel(TodoModelStore, id);
  return (
    <div>
      {todo.name}
      <div>
        {todo.owner_ids.map(id => (
          <Avatar userId={id} />
        ))}
      </div>
    </div>
  );
};
```

Beautiful! Now we have two new components that cna 

### TODO
- Downfall of many "new" components with this approach
  - we had to make a tiny component for Avatar, when it only cared about
- useReducer possible? might alleviate the Hooks Explosion™
- illlustrate how `mapStateToProps` kinda does this?
- Could we have created a DataLoader-like `useManyModels` Hook?