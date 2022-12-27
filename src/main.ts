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

//hover image info
//edit quantity
//cart circle quantity info
//modular

let products:ProductProps[] = []
let cart:CartProps[] = []
let currentPage = 1

export function setProducts(value:any[]){
  products = value.map(({name, _id,category,description,image,price }) => ({name, _id,category,description,image,price})) as ProductProps[]
  render()
  renderCart()
  setTotal()
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
  renderCart()
  setTotal()
}

const removeProduct = (id:string,removeAll?:'removeAll') => {
  const {product,quantity} = cart.find(({product}) => product._id===id) as CartProps

  if(quantity===1 || removeAll){
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
  renderCart()
  setTotal()
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
    addToCart.className='btn btn-outline-success'
    buttonAdd.innerText='+'
    buttonAdd.className='btn btn-outline-primary'
    buttonRemove.innerText='-'
    buttonRemove.className='btn btn-outline-primary'
    display.className='px-3 d-block border-top border-bottom border-primary'
    display.style.paddingTop='.4rem'
    display.style.paddingBottom='.4rem'
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
    buttonContainer.className="btn-group d-flex align-items-center w-75 mx-auto" 
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

const liPages = document.getElementsByClassName('page-item') as unknown as NodeList
const nodes = Array.prototype.slice.call(liPages,0) 
nodes[0].classList.add('active')
nodes.forEach((element:HTMLUListElement) => element.addEventListener('click',() => setPage(Number(element.textContent))))

function setPage(page:number){
  if(page===currentPage) return
  currentPage=page
  if(page===2){
    nodes[0].classList.remove('active')
    nodes[1].classList.add('active')
  } else {
    nodes[1].classList.remove('active')
    nodes[0].classList.add('active')
  }
  fetchData(currentPage)
}

function renderCart(){
  const cartContainer = document.getElementById('cart') as HTMLDivElement
  cartContainer.innerText=''

  if(cart.length!==0){
    cart.map(({product})=> {
      const {_id:id,image,name,price} = product as ProductProps
      const quantity = cart.find(({product}) => product._id===id)?.quantity
      
      const item = document.createElement('div')
      const img = document.createElement('img')
      const productName = document.createElement('p')
      const productInfo = document.createElement('div')
      const productPrice = document.createElement('span')
      const productQuantity = document.createElement('span')
      const buttonGroup = document.createElement('div')
      const removeItem = document.createElement('button')
      const removeIcon = document.createElement('i')
      const buttonAdd =  document.createElement('button')
      const buttonRemove = document.createElement('button')

      img.src=image
      img.className='h-25 me-3'
      img.style.maxWidth='40px'

      productName.textContent=name
      productName.style.fontSize='.8rem'
      productName.className='text-secondary'

      productPrice.textContent=`$${price}`
      productQuantity.textContent=`x${String(quantity)}`
      productPrice.className='fw-medium'
      productQuantity.className='fw-light'
      productQuantity.style.fontSize='smaller'
      productInfo.className='d-flex flex-column align-items-end justify-content-center mx-2'
      productInfo.appendChild(productPrice)
      productInfo.appendChild(productQuantity)

      buttonAdd.textContent='+'
      buttonRemove.textContent='-'
      removeIcon.className='bi bi-trash'
      removeItem.className='btn btn-outline-danger px-1 py-0'
      buttonAdd.className='btn btn-outline-primary px-1 py-0'
      buttonRemove.className='btn btn-outline-primary px-1 py-0'
      buttonGroup.className='btn-group-vertical'
      removeItem.appendChild(removeIcon)
      buttonGroup.appendChild(removeItem)
      buttonGroup.appendChild(buttonAdd)
      buttonGroup.appendChild(buttonRemove)
      buttonRemove.addEventListener('click',() => removeProduct(id))
      buttonAdd.addEventListener('click',() => addProduct(id))
      removeItem.addEventListener('click',() => removeProduct(id,'removeAll'))

      item.className='d-flex justify-content-between align-items-center my-1'
      item.appendChild(img)
      item.appendChild(productName)
      item.appendChild(productInfo)
      item.appendChild(buttonGroup)

      cartContainer.appendChild(item)
    })
  } else {
    const advice = document.createElement('div')
    const adviceTitle = document.createElement('h4')
    const icon = document.createElement('i')

    adviceTitle.textContent='Cart is empty'
    icon.className='bi bi-emoji-smile-upside-down my-1'
    icon.style.transform='scale(2)'

    advice.className='d-flex align-items-center flex-column'
    advice.appendChild(adviceTitle)
    advice.appendChild(icon)

    cartContainer.appendChild(advice)
  }
}

let total = 0
function setTotal(){
  const totalPrice = document.getElementById('total') as HTMLSpanElement
  if(cart.length===0){
    total=0
  } else { 
    total = (cart.map(({product,quantity}) => product.price*quantity).reduce((prev,cur)=> prev+cur))
  }
  totalPrice.textContent=`$${String(total.toFixed(2))}`
}

fetchData(currentPage)