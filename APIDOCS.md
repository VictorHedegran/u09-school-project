# LevelUpIrl API Documentation

## Overview

Brief description of what this API does and its purpose.

---

## Table of Contents

- [Users](#users)
  - [Login](#login)
  - [Logout](#logout)
  - [User data](#user-data)
  - [Update user experience points](#update-user-experience-points)
- [Todos](#todos)
  - [Get todos](#get-todos)
  - [Create todo](#create-todo)
  - [Update todo](#update-todo)
  - [Delete todo](#delete-todo)
- [Items](#items)
  - [Get items](#get-items)
- [Tasks](#tasks)
  - [Get tasks](#get-tasks)

---

## Users

> ⚠️**Important:** Every request under users should start with https://u09firstdeploy-production.up.railway.app/api/v1/internal/users

---

### Login

[Top](#table-of-contents)

#### Route

```
/google/auth
```

#### Method

> 🔵POST

#### Description

This endpoint uses Google OAuth 2.0 to log in the user.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

#### Body

- `code` (string) - Code from `useGoogleLogin` in the `@react-oauth/google` package.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";
    import { useGoogleLogin } from "@react-oauth/google";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal/users";

      const googleLogin = useGoogleLogin({
      onSuccess: async ({ code }) => {
        try {
          const user = await axios.post(
            `${api}/google/auth`,
            { code },
            {
              withCredentials: true,
            }
          );
          return "success";
        } catch (error) {
          return "error";
        }
      },
      flow: "auth-code",
    });

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns user object.</summary>

    {
        profile: {
            displayName: string
            imageUrl: string
            email: string
        }
        levels: {
            dty: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            exr: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            hlt: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            mnd: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
        }
        customization: {
            theme: string
            border: string
        }
        inventory: {
            coins: number
            items: string[]
        }
    }

</details>
<details>
    <summary>Updates session cookie.</summary>

    {
        userId: string,
        accessToken: string,
        expiryDate: Date()
    }

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### Logout

[Top](#table-of-contents)

#### Route

```
/google/logout
```

#### Method

> 🔵POST

#### Description

This endpoint logs out the user.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal/users";

    axios.post(
      `${api}/google/logout`,
      {},
      {
          withCredentials: true,
      }
    )

</details>

#### Response

> 🟢200 (ok)

Deletes session cookie.
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### User data

[Top](#table-of-contents)

#### Route

```
/userdata
```

#### Method

> 🔵GET

#### Description

This endpoint can fetch user data of the logged in user.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal/users";

    axios.get(
      `${api}/userdata`,
      {
          withCredentials: true,
      }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns user object.</summary>

    {
        profile: {
            displayName: string
            imageUrl: string
            email: string
        }
        levels: {
            dty: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            exr: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            hlt: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
            mnd: {
                title: string
                levelNumber: number
                expRequired: number
                exp: number
                message: string
            }
        }
        customization: {
            theme: string
            border: string
        }
        inventory: {
            coins: number
            items: string[]
        }
    }

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### Update user experience points

[Top](#table-of-contents)

#### Route

```
/update/exp
```

#### Method

> 🔵POST

#### Description

This endpoint is used to update the users exp upon todo completion.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

#### Body

- `newExp` ({
  dty: Number,
  exr: Number,
  hlt: Number,
  mnd: Number,
  }) - The new total exp is calculated on the client but adding the completion reward to the user object. The `newExp` object should be the new TOTAL.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal/users";

    const newExp = {
      dty: 10,
      exr: 10,
      hlt: 10,
      mnd: 10,
    }

    axios.put(
      `${api}/update/exp`,
      { newExp },
      { withCredentials: true }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns updated user levels (part of user object).</summary>

    levels: {
      dty: {
          title: string
          levelNumber: number
          expRequired: number
          exp: number
          message: string
      }
      exr: {
          title: string
          levelNumber: number
          expRequired: number
          exp: number
          message: string
      }
      hlt: {
          title: string
          levelNumber: number
          expRequired: number
          exp: number
          message: string
      }
      mnd: {
          title: string
          levelNumber: number
          expRequired: number
          exp: number
          message: string
      }
    }

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

## Todos

> ⚠️**Important:** Every request under users should start with https://u09firstdeploy-production.up.railway.app/api/v1/internal/todos

### Get todos

[Top](#table-of-contents)

#### Route

```
/
```

#### Method

> 🟢GET

#### Description

Returns all todos for the currently logged in user

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal";

    axios.get(
      `${api}/todos`,
      { withCredentials: true }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns an array of todo objects</summary>

    [
      {
        userId: String,
        title: String,
        type: String,
        name: String,
        description: String,
        stats: {
            dty: Number,
            exr: Number,
            hlt: Number,
            mnd: Number,
        },
        coins: Number,
        category: String,
        status: String,
        schedule: {
            dueDate: Date,
            repeatable: Boolean,
            repeatInterval: String,
        },
      }
    ]

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### Create todo

[Top](#table-of-contents)

#### Route

```
/
```

#### Method

> 🔵POST

#### Description

Creating a todo for the selected user.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

#### Body

- `todoData` ({
  title: String,
  type: String,
  name: String,
  description: String,
  dty: Number,
  exr: Number,
  hlt: Number,
  mnd: Number,
  category: String,
  status: String,
  dueDate: Date,
  repeatable: Boolean,
  repeatInterval: String,
  }) todo data

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal";

    const todoData = {
        title: 'title',
        type: 'task',
        name: 'name',
        description: 'description',
        dty: 10,
        exr: 10,
        hlt: 10,
        mnd: 10,
        category: 'category',
        status: 'unfinished',
        dueDate: new Date(),
        repeatable: false,
        repeatInterval: '',
    }

    axios.put(
      `${api}/todos`,
      { todoData },
      { withCredentials: true }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns the created todo object</summary>

    {
      userId: String,
      title: String,
      type: String,
      name: String,
      description: String,
      stats: {
          dty: Number,
          exr: Number,
          hlt: Number,
          mnd: Number,
      },
      coins: Number,
      category: String,
      status: String,
      schedule: {
          dueDate: Date,
          repeatable: Boolean,
          repeatInterval: String,
      },
    }

</details>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### Update todo

[Top](#table-of-contents)

#### Route

```
/
```

#### Method

> 🟣PUT

#### Description

Updates status for selected todo.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

#### Body

- `status` (String) - Accepted values: ['unfinished', 'finished', 'overdue']

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal";

    const status = "finished"

    axios.put(
      `${api}/todos`,
      { status },
      { withCredentials: true }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns the updated todo object</summary>

    {
      userId: String,
      title: String,
      type: String,
      name: String,
      description: String,
      stats: {
          dty: Number,
          exr: Number,
          hlt: Number,
          mnd: Number,
      },
      coins: Number,
      category: String,
      status: String,
      schedule: {
          dueDate: Date,
          repeatable: Boolean,
          repeatInterval: String,
      },
    }

</details>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

### Delete todo

[Top](#table-of-contents)

#### Route

```
/:todoId
```

#### Method

> 🔴DELETE

#### Description

Delete selected todo.

> ⚠️**Important:** Make sure the request has credentials included to properly handle cookies.

#### Params

- `todoId` (String) - Id for the selected todo.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal";


    axios.delete(
      `${api}/todos/${todoId}`,
      { withCredentials: true }
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns the deleted todo object</summary>

    {
      userId: String,
      title: String,
      type: String,
      name: String,
      description: String,
      stats: {
          dty: Number,
          exr: Number,
          hlt: Number,
          mnd: Number,
      },
      coins: Number,
      category: String,
      status: String,
      schedule: {
          dueDate: Date,
          repeatable: Boolean,
          repeatInterval: String,
      },
    }

</details>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

If no todo with the todo id is found the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

## Items

> ⚠️**Important:** Every request under users should start with https://u09firstdeploy-production.up.railway.app/api/v1/internal/items

### Get items

[Top](#table-of-contents)

#### Route

```
/
```

#### Method

> 🟢GET

#### Description

Returns one or more items. Can be queried based on type or id.

#### Params

- `id` (String) - item id.
- `type` (String) - type of item ('theme' or 'border').

> If both 'id' and 'type' is passed to the route, only 'id' will be used. If no params are passed in, all items will be returned.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/internal";

    // returns one item which matches the id
    axios.get(
      `${api}/items?id=${id}`
    )

    // returns items based on the specified type
    axios.get(
      `${api}/items?type=${type}`
    )

    // returns all items
    axios.get(
      `${api}/items`
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns an array of item objects</summary>

    [
      {
        type: String,
        name: String,
        class: String,
        color: String,
        cost: Number,
        description: String,
      }
    ]

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---

## Tasks

> ⚠️**Important:** Every request under users should start with https://u09firstdeploy-production.up.railway.app/api/v1/public/tasks

### Get tasks

[Top](#table-of-contents)

#### Route

```
/
```

#### Method

> 🟢GET

#### Description

Returns one or more tasks. Can be queried based on stat, category or id.

These tasks are used as templates to create todos.

#### Params

- `id` (String) - task id.
- `stat` (String) - type of stat ('dty', 'exr', 'hlt', 'mnd').
- `category` (String) - category.

> If multiple params are passed to the route, only one of them will be used. The order is as follows: 1. 'id', 2. 'category', 3. 'stat'.

<details>
    <summary>Example Request using the Axios library</summary>
    
    import axios from "axios";

    const api = "https://u09firstdeploy-production.up.railway.app/api/v1/public";

    // returns one task which matches the id
    axios.get(
      `${api}/tasks?id=${id}`
    )

    // returns tasks based on the specified stat
    axios.get(
      `${api}/tasks?stat=${stat}`
    )

    // returns tasks based on the specified category
    axios.get(
      `${api}/tasks?category=${category}`
    )

    // returns all tasks
    axios.get(
      `${api}/tasks`
    )

</details>

#### Response

> 🟢200 (ok)

<details>
    <summary>Returns an array of task objects</summary>

    [
      {
        _id: ObjectId,
        type: String,
        name: String,
        description: String,
        stats: {
            dty: Number,
            exr: Number,
            hlt: Number,
            mnd: Number,
        },
        coins: Number,
        category: String,
      }
    ]

</details>
<br>

> 🔴401 (Unauthorized)

If no user id is found in the session cookie the server will return an error.

> 🔴500 (Internal Server Error)

Check server logs for more information.

---
