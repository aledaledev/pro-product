import { setProducts } from "../main"

export default async (page:number) =>  {
    const data = await fetch(`https://peticiones.online/api/products?page=${page}`)
    const json = await data.json()
    setProducts(json.results)
}