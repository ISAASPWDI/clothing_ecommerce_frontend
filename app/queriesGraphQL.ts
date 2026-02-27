import { gql } from "@apollo/client";

//USUARIOS
export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
      phone
      email
      image
      rol
      authType
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      firstName
      lastName
      email
      phone
      authType
      rol
    }
  }
`;
export const LOGIN_USER = gql`
  query($email: String!, $password: String) {
    findUserByEmail(email: $email, password: $password) {
      id
      firstName
      lastName
      name
      email
      image
      rol
      authType
      phone
      token
    }
  }
`;
export const FIND_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      firstName
      lastName
      name
      email
      image
      rol
      authType
      phone
      token
    }
  }
`;
export const GET_ADDRESSES = gql`
  query GetAddresses {
    getAddresses {
      id
      firstName
      lastName
      address
      optAddress
      city
      zipCode
      phone
    }
  }
`;
export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      id
      firstName
      lastName
      address
      optAddress
      city
      zipCode
      phone
    }
  }
`;
export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: Int!, $input: UpdateAddressInput!) {
    updateAddress(id: $id, input: $input) {
      id
      firstName
      lastName
      address
      optAddress
      city
      zipCode
      phone
    }
  }
`;
export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: Int!) {
    deleteAddress(id: $id)
  }
`;
//PRODUCTOS
export const GET_ALL_CATEGORIES = gql`
  query{
    getAllCategories {
      id
      name
      metaTitle
      metaDescription
      metaKeywords
      slug
    }
  }

`;
export const GET_ALL_COLORS = gql`
  query{
    getAllColors {
      id
      color
    }
  }

`;
export const GET_ALL_AGES = gql`
  query{
    getAllAges {
      id
      range
    }
  }

`;
export const GET_ALL_GENRES = gql`
  query GetAllGenres {
    getAllGenres {
      id
      genre
    }
  }
`;
export const GET_ALL_SIZES = gql`
  query{
    getAllSizes {
      id
      size
    }
  }
`;
export const FIND_PRODUCTS_WITH_GENRES = gql`
  query FindProductsByGenre($id: Int!) {
    findAllProducts(relation: genre, id: $id) {
      id
      name
      price
      genres {
        id
        genre
      }
    }
  }
`;
export const FIND_PRODUCTS_WITH_CATEGORIES = gql`
  query FindProductsByGenre($id: Int!) {
    findAllProducts(relation: category, id: $id) {
      id
      name
      price
      categories {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_RELATION = gql`
  query GetProductsByRelation($filterData: [FilterDataInput!]!, $page: Int, $maxPrice: Float, $minPrice: Float, $sortBy: String, $searchTerm: String) {
    findProductsByRelation(filterData: $filterData, page: $page, maxPrice: $maxPrice, minPrice: $minPrice, sortBy: $sortBy, searchTerm: $searchTerm) {
      products {
        id
        name
        price
        slug
        description
      }
      isProducts
    }
  }
`;

// New queries for details 
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProduct($identifier: String!) {
    getProduct(identifier: $identifier) {
      id
      name
      slug
      price
      description
      quantity
      reviewCount
      metaTitle
      metaDescription
      metaKeywords
      colors {
        id
        color
      }
      sizes {
        id
        size
      }
      categories {
        id
        name
        slug
      }
      genres {
        id
        genre
      }
      ages {
        id
        range
      }
      details {
        id
        key
        value
      }
      images {
        id
        imagePath
        alt
        sortOrder
        isMain
      }
    }
  }
`;

// Query para productos relacionados
export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($productId: Int!, $limit: Int = 4) {
    getRelatedProducts(productId: $productId, limit: $limit) {
      id
      name
      slug
      price
      description
    }
  }
`;

//Payments
export const CREATE_PAYMENT_PREFERENCE = gql`
  mutation CrearPreferenciaPago($input: PreferenciaInput!) {
    crearPreferenciaPago(input: $input) {
      id
      initPoint
      sandboxInitPoint
      autoReturn
      backUrls {
        success
        failure
        pending
      }
    }
  }
`;
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $limit: Int) {
    allOrders(page: $page, limit: $limit) {
      orders {
        id
        externalReference
        status
        total
        createdAt
        orderItems {
          name
          quantity
          price
        }
      }
      pagination {
        currentPage
        totalPages
        totalOrders
        hasNextPage
        hasPrevPage
      }
    }
  }
`;
export const GET_MY_ORDERS_PAGINATED = gql`
  query GetMyOrdersPaginated($page: Int, $limit: Int) {
    myOrdersPaginated(page: $page, limit: $limit) {
      orders {
        id
        externalReference
        status
        total
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalOrders
        hasNextPage
        hasPrevPage
      }
    }
  }
`;
export const GET_MY_ORDER_DETAIL = gql`
  query GetMyOrderDetail($externalReference: String!) {
    myOrderDetail(externalReference: $externalReference) {
      id
      externalReference
      status
      total
      subtotal
      itemsCount
      createdAt
      paidAt
      
      orderItems {
        id
        name
        quantity
        price
        selectedColor
        selectedSize
      }
      
      customerInfo {
        firstName
        lastName
        email
        phone
        address
        apartment
        city
        province
        zipCode
      }
      
      paymentMethod {
        id
        name
        description
      }
      mercadoPagoPaymentId
    }
  }
`;
