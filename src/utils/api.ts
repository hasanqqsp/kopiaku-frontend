import axios from 'axios'

axios.defaults.baseURL = 'http://api-kopiaku.test.h14.my.id/graphql'

const axiosWithAuth = axios.create()
axiosWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    // preserve existing headers and avoid assigning a plain object to AxiosHeaders
    config.headers = {
      ...(config.headers as Record<string, unknown>),
      Authorization: `Bearer ${token}`,
    } as never
  }
  return config
})

axiosWithAuth.interceptors.response.use(
  (response) => {
    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors)
      if (response.data.errors[0].extensions.code === 'AUTH_NOT_AUTHENTICATED') {
        // Handle unauthenticated error globally
        window.location.href = '/login'
        localStorage.removeItem('authToken')
        localStorage.removeItem('needsPhotoVerification')
      }
    }
    return response
  },
  (error) => Promise.reject(error),
)

axiosWithAuth.defaults.baseURL = 'http://api-kopiaku.test.h14.my.id/graphql'

export async function login(email: string, password: string) {
  const query = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        email
        id
        isActive
        name
        profilePictureUrl
        token
        username
      }
    }
  `

  const response = await axios.post('/', {
    query,
    variables: { input: { username: email, password } },
  })
  if (response.data.data.login.token) {
    localStorage.setItem('authToken', response.data.data.login.token || '')
  }

  return response.data.data.login
}

export async function checkIn({ file }: { file: File }) {
  const operations = JSON.stringify({
    query: `
      mutation ($image: Upload!) {
        checkIn(image: $image) {
          id
          userId
          imageUrl
          checkInTime
          validated
        }
      }
    `,
    variables: {
      image: null,
    },
  })

  const map = JSON.stringify({
    '0': ['variables.image'],
  })

  const formData = new FormData()
  formData.append('operations', operations)
  formData.append('map', map)
  formData.append('0', file)

  return axiosWithAuth
    .post('/', formData, {
      headers: {
        'GraphQL-Preflight': 1,
      },
    })
    .then((response) => {
      return response.data.data.checkIn
    })
}

export async function getCurrentUser() {
  const query = `
    query MyProfile {
      myProfile {
        id
        name
        username
        email
        role
        contact
        isActive
        profilePictureUrl
      }
    }
  `

  const response = await axiosWithAuth.post('', {
    query,
    variables: {},
  })

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message)
  }

  return response.data.data.myProfile
}

export async function fetchUsers({
  first = 10,
  after = null,
}: {
  first?: number
  after?: string | null
} = {}): Promise<{
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
  nodes: Array<{
    id: string
    name: string
    username: string
    email: string
    role: string
    contact: string
    isActive: boolean
    profilePictureUrl: string
  }>
}> {
  const query = `
    query Users($first: Int, $after: String) {
      users(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          username
          email
          role
          contact
          isActive
          profilePictureUrl
        }
      }
    }
  `

  const variables = { first, after }

  const res = await axiosWithAuth.post('', { query, variables })

  if (res.data.errors) {
    console.error(res.data.errors)
    throw new Error(res.data.errors[0].message)
  }

  return res.data.data.users
}

export async function addEmployees({
  name,
  username,
  email,
  password,
  contact = null,
}: {
  name: string
  username: string
  email: string
  password: string
  contact?: string | null
}) {
  const mutation = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        id
        name
        username
        email
        role
        contact
        isActive
        profilePictureUrl
      }
    }
  `

  const input = {
    name,
    username,
    email,
    password,
    contact,
  }

  try {
    const res = await axiosWithAuth.post('', {
      query: mutation,
      variables: { input },
    })

    if (res.data.errors) {
      throw new Error(res.data.errors[0].message)
    }

    return res.data.data.register
  } catch (err) {
    console.error('AddEmployees error:', err)
    throw err
  }
}

export async function deleteUser({ userId }: { userId: string }) {
  const mutation = `
    mutation DeleteUser($userId: String!) {
      deleteUser(userId: $userId)
    }
  `

  const res = await axiosWithAuth.post('', {
    query: mutation,
    variables: { userId },
  })

  if (res.data.errors) {
    throw new Error(res.data.errors[0].message)
  }

  return res.data.data.deleteUser // Boolean: true / false
}

// export const updateUserProfile = async ({
//   userId,
//   input,
//   profilePicture,
// }: {
//   userId: string
//   input: {
//     name?: string
//     email?: string
//     contact?: string
//   }
//   profilePicture?: File
// }) => {
//   const formData = new FormData()

//   // Kirim ke endpoint GraphQL seperti biasa
//   const query = `
//     mutation UpdateUserProfile(
//       $userId: String!
//       $input: RegisterInput!
//     ) {
//       updateUserProfile(
//         userId: $userId,
//         input: $input,
//       ) {
//         id
//         name
//         username
//         email
//         role
//         contact
//         isActive
//         profilePictureUrl
//       }
//     }
//   `

//   formData.append(
//     'operations',
//     JSON.stringify({
//       query,
//       variables: {
//         userId,
//         input,
//         // profilePicture: profilePicture ? null : undefined,
//       },
//     }),
//   )

//   formData.append(
//     'map',
//     JSON.stringify({
//       '0': ['variables.profilePicture'],
//     }),
//   )

//   // if (profilePicture) {
//   //   formData.append('0', profilePicture)
//   // }

//   const res = await axiosWithAuth.post('', formData, {
//     headers: { 'Content-Type': 'multipart/form-data', 'GraphQL-Preflight': 1 },
//   })

//   return res.data.data.updateUserProfile
// }

export const updateUserProfile = async ({
  userId,
  input,
  file,
}: {
  userId: string
  input: {
    name: string
    email: string
    username: string
    contact?: string
    password?: string
  }
  file?: File
}) => {
  if (file) {
    const formData = new FormData()

    // Tambahkan userId
    formData.append('userId', userId)

    // Kirim ke endpoint GraphQL seperti biasa
    const query = `
    mutation UpdateUserProfile(
      $userId: String!
      $input: RegisterInput!
      $profilePicture: Upload
    ) {
      updateUserProfile(
        userId: $userId,
        input: $input,
        profilePicture: $profilePicture
      ) {
        id
        name
        username
        email
        role
        contact
        isActive
        profilePictureUrl
      }
    }
  `

    formData.append(
      'operations',
      JSON.stringify({
        query,
        variables: {
          userId,
          input,
          profilePicture: file ? null : undefined,
        },
      }),
    )

    formData.append(
      'map',
      JSON.stringify({
        '0': ['variables.profilePicture'],
      }),
    )

    formData.append('0', file)

    const res = await axiosWithAuth.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'GraphQL-Preflight': 1 },
    })

    return res.data.data.updateUserProfile
  }
  const query = `
    mutation UpdateUserProfile($userId: String!, $input: RegisterInput!) {
      updateUserProfile(
        userId: $userId,
        input: $input
      ) {
        id
        name
        username
        email
        role
        contact
        isActive
        profilePictureUrl
      }
    }
  `

  const res = await axiosWithAuth.post('', {
    query,
    variables: {
      userId,
      input,
    },
  })

  return res.data.data.updateUserProfile
}

export const getMyPresence = async () => {
  const query = `
    query {
      myPresence {
        id
        userId
        imageUrl
        checkInTime
        validated
      }
    }
  `

  const res = await axiosWithAuth.post('/', {
    query,
  })

  return res.data.data.myPresence
}

export const getMenus = async ({
  first = 10,
  after = null,
  last = null,
  before = null,
  where = null,
  order = null,
}: {
  first?: number
  after?: string | null
  last?: number | null
  before?: string | null
  where?: unknown
  order?: unknown
} = {}) => {
  const query = `
    query GetMenus(
      $first: Int
      $after: String
      $where: MenuFilterInput
    ) {
      menus(
        first: $first
        after: $after
        where: $where
      ) {
        nodes {
          id
          name
          description
          category
          price
          imageUrl
          isAvailable
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `

  const res = await axiosWithAuth.post('/', {
    query,
    variables: {
      first,
      after,
      last,
      before,
      where,
      order,
    },
  })

  return res.data.data.menus
}

export const fetchPresences = async ({
  first = 1000,
  after = null,
  where = null,
  order = null,
}: {
  first?: number
  after?: string | null
  where?: unknown
  order?: unknown
} = {}): Promise<{
  totalCount: number
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: string | null
    startCursor: string | null
  }
  nodes: Array<{
    id: string
    userId: string
    imageUrl: string
    checkInTime: string
    validated: boolean
  }>
}> => {
  const query = `
    query Presences($first: Int, $after: String, $where: PresenceFilterInput, $order: [PresenceSortInput!]) {
      presences(
        first: $first
        after: $after
        where: $where
        order: $order
      ) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          id
          userId
          imageUrl
          checkInTime
          validated
        }
      }
    }
  `

  const variables = {
    first,
    after,
    where,
    order,
  }

  const res = await axiosWithAuth.post('/', {
    query,
    variables,
  })

  return res.data.data.presences
}

export async function fetchStocks({ first = 1000, after = null, where = null } = {}) {
  const query = `
    query($first: Int, $after: String, $where: StockFilterInput) {
      stocks(first: $first, after: $after, where: $where) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          itemName
          quantity
          unit
          notificationThreshold
        }
      }
    }
  `

  const variables = { first, after, where }

  const response = await axiosWithAuth.post('', {
    query,
    variables,
  })

  return response.data.data.stocks
}

export async function addStock({
  itemName,
  quantity,
  unit,
  notificationThreshold,
}: {
  itemName: string
  quantity: number
  unit: string
  notificationThreshold: number
}) {
  const mutation = `
    mutation($itemName: String!, $quantity: Int!, $unit: String!, $notificationThreshold: Int!) {
      addStock(
        itemName: $itemName
        quantity: $quantity
        unit: $unit
        notificationThreshold: $notificationThreshold
      ) {
        id
        itemName
        quantity
        unit
        notificationThreshold
      }
    }
  `

  const variables = { itemName, quantity, unit, notificationThreshold }

  const response = await axiosWithAuth.post('', {
    query: mutation,
    variables,
  })

  return response.data.data.addStock
}

export async function createMenu({
  menu,
  image,
}: {
  menu: {
    name: string
    description: string
    category: string
    price: number
  }
  image: File
}) {
  const mutation = `
    mutation($menu: MenuInput!, $image: Upload) {
      createMenu(menu: $menu, image: $image) {
        id
        name
        description
        category
        price
        imageUrl
      }
    }
  `

  const formData = new FormData()
  formData.append(
    'operations',
    JSON.stringify({
      query: mutation,
      variables: {
        menu,
        image: null, // harus null di operasi karena upload dipisah
      },
    }),
  )

  formData.append('map', JSON.stringify({ '0': ['variables.image'] }))
  formData.append('0', image)

  const response = await axiosWithAuth.post('', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'GraphQL-Preflight': 1 },
  })

  return response.data.data.createMenu
}

export async function validatePresence(presenceId: string) {
  const mutation = `
    mutation($presenceId: String!) {
      validatePresence(presenceId: $presenceId) {
        id
        userId
        imageUrl
        checkInTime
        validated
      }
    }
  `

  const response = await axiosWithAuth.post('', {
    query: mutation,
    variables: { presenceId },
  })

  return response.data.data.validatePresence
}

export const changeUserPassword = async ({
  userId,
  newPassword,
}: {
  userId: string
  newPassword: string
}) => {
  const mutation = `
    mutation($userId: String!, $newPassword: String!) {
      changeUserPassword(userId: $userId, newPassword: $newPassword) {
        id
        name
        username
        email
        role
        isActive
      }
    }
  `

  const res = await axiosWithAuth.post('', {
    query: mutation,
    variables: { userId, newPassword },
  })

  return res.data.data.changeUserPassword
}

export const getRecipes = async ({ first = 1000, after = null, where = null }) => {
  const query = `
    query ($first: Int, $after: String, $where: RecipeFilterInput) {
      recipes(first: $first, after: $after, where: $where) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          menuId
          ingredients {
            stockId
            quantity
          }
        }
      }
    }
  `

  const res = await axiosWithAuth.post('', {
    query,
    variables: { first, after, where },
  })

  return res.data.data.recipes
}

export const deleteMenu = async (id: string) => {
  const mutation = `
    mutation($id: String!) {
      deleteMenu(id: $id)
    }
  `

  const res = await axiosWithAuth.post('', {
    query: mutation,
    variables: { id },
  })

  return res.data.data.deleteMenu
}

export const deleteRecipe = async (recipeId: string) => {
  const mutation = `
    mutation($recipeId: String!) {
      deleteRecipe(recipeId: $recipeId)
    }
  `

  const res = await axiosWithAuth.post('', {
    query: mutation,
    variables: { recipeId },
  })

  return res.data.data.deleteRecipe
}

export const createRecipe = async (
  menuId: string,
  ingredients: Array<{
    stockId: string
    quantity: number
  }>,
) => {
  const mutation = `
    mutation($menuId: String!, $ingredients: [RecipeIngredientInput!]!) {
      createRecipe(menuId: $menuId, ingredients: $ingredients) {
        id
        menuId
        ingredients {
          stockId
          quantity
        }
      }
    }
  `

  const res = await axiosWithAuth.post('', {
    query: mutation,
    variables: { menuId, ingredients },
  })

  return res.data.data.createRecipe
}

export async function createTransactionAPI(transaction: {
  userId: string
  menuItems: Array<{
    menuId: string
    quantity: number
  }>
  totalAmount: number
  status: string
  transactionDate: string
}) {
  const query = `
    mutation CreateTransaction($transaction: TransactionInput!) {
      createTransaction(transaction: $transaction) {
        id
        userId
        totalAmount
        status
        transactionDate
      }
    }
  `

  const response = await axiosWithAuth.post('/', {
    query,
    variables: { transaction },
  })

  return response.data.data.createTransaction
}

export async function updateTransactionStatusAPI(transactionId: string, status: string) {
  const query = `
    mutation UpdateTransactionStatus($transactionId: String!, $status: String!) {
      updateTransactionStatus(transactionId: $transactionId, status: $status) {
        id
        status
      }
    }
  `

  const response = await axiosWithAuth.post('/', {
    query,
    variables: { transactionId, status },
  })

  return response.data.data.updateTransactionStatus
}

export async function deleteTransactionAPI(transactionId: string) {
  const query = `
    mutation DeleteTransaction($transactionId: String!) {
      deleteTransaction(transactionId: $transactionId)
    }
  `

  const response = await axiosWithAuth.post('/', {
    query,
    variables: { transactionId },
  })

  return response.data.data.deleteTransaction
}
export async function getTransactionsAPI({ first = 10, after = null, where = null, order = null }) {
  const query = `
    query GetTransactions($first: Int, $after: String, $where: TransactionFilterInput, $order: [TransactionSortInput!]) {
      transactions(first: $first, after: $after, where: $where, order: $order) {
        nodes {
          id
          userId
          totalAmount
          status
          transactionDate
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  `

  const response = await axiosWithAuth.post('/', {
    query,
    variables: { first, after, where, order },
  })

  return response.data.data.transactions
}
