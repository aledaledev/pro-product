import './assets/style.css'
import fetchData from './ts/fetchData'

interface ProductProps {
  _id:string,
  name:string,
  description:string,
  price:number,
  category:'mujer'|'hombre'|'niño',
  image:string
}

interface CartProps {
  product:ProductProps,
  quantity:number,
}

let products:ProductProps[] = []
let cart:CartProps[] = []

export function setProducts(value:any[]){
  products = value.map(({name, _id,category,description,image,price }) => ({name, _id,category,description,image,price})) as ProductProps[]
  render()
}

export function setCart(value:CartProps[]){
  cart=value
}

const addProduct = (id:string) => {
  const inCart = cart.some(({product}) => product._id===id)

  if(inCart) {
    const {product,quantity} = cart.find(({product}) => product._id===id) as CartProps
    const productIndex = cart.findIndex(({product}) => product._id===id)
    const updateCart = [...cart]
    const productCart = {
      product,
      quantity:quantity+1,
    }
    updateCart[productIndex]=productCart as CartProps
    setCart(updateCart)
  } else {
    const currentProduct = products.find(product => product._id===id) as ProductProps
    const productCart = {
      product:currentProduct,
      quantity:1,
    }
    const updateCart = [...cart, productCart]
    setCart(updateCart)
  }
  render()
}

const removeProduct = (id:string) => {
  const {product,quantity} = cart.find(({product}) => product._id===id) as CartProps

  if(quantity===1){
    const updateCart = cart.filter(({product}) => product._id!==id)
    setCart(updateCart)
  } else {
    const productIndex = cart.findIndex(({product}) => product._id===id)
    const updateCart = [...cart]
    const productCart = {
      product,
      quantity:quantity-1,
    }
    updateCart[productIndex] = productCart
    setCart(updateCart)
  }
  render()
}

function render(){
  const productsContainer = document.getElementById('product-container') as HTMLDivElement
  productsContainer.innerText=''

  products.map(({name, _id:id,category,description,image,price }) => {

    const quantity = cart.find(({product}) => product._id===id)?.quantity | 0

    const card = document.createElement('div')
    const img = document.createElement('img')
    const cardBody = document.createElement('div')
    const title = document.createElement('h5')
    const cardDescription = document.createElement('p')
    const categoryText = document.createElement('p')
    const priceText = document.createElement('p')
    const addToCart = document.createElement('button')
    const buttonContainer = document.createElement('div')
    const buttonAdd = document.createElement('button')
    const buttonRemove = document.createElement('button')
    const display = document.createElement('span')
    const cardAuxiliar = document.createElement('div')

    img.src=image
    img.className="card-img-top h-50 w-50 mx-auto" 
    card.appendChild(img)

    title.textContent=name
    title.className="card-title"
    priceText.textContent=`price: ${price}`
    cardBody.appendChild(title)
    cardBody.appendChild(priceText)
    cardBody.className="card-body"
    card.appendChild(cardBody)

    addToCart.innerText='add to cart'
    addToCart.className='btn btn-success'
    buttonAdd.innerText='+'
    buttonAdd.className='btn btn-success'
    buttonRemove.innerText='-'
    buttonRemove.className='btn btn-danger'
    display.textContent=String(quantity)

    if(quantity===0){
      buttonContainer.appendChild(addToCart)
      addToCart.addEventListener('click',() => addProduct(id))
    } else {
      buttonContainer.appendChild(buttonRemove)
      buttonContainer.appendChild(display)
      buttonContainer.appendChild(buttonAdd)
      buttonRemove.addEventListener('click',() => removeProduct(id))
      buttonAdd.addEventListener('click',() => addProduct(id))
    }
    cardBody.appendChild(buttonContainer)

    card.className="card"
    card.appendChild(cardBody)
    cardAuxiliar.className='col-6'

    cardDescription.textContent=description
    categoryText.textContent=category

    cardAuxiliar.appendChild(card)
    productsContainer.appendChild(cardAuxiliar)
  })
}

fetchData(1)