import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import {selectCartItems, selectSubtotal, selectTotalItems, selectTaxAmount, selectGrandTotal, selectDiscount} from '@/store/selectors'
import { Minus, Plus, Receipt, Trash2 } from 'lucide-react'
import { clearCart, removeFromCart, updateQty } from '../../store/cartSlice'
import CheckoutDialog from './CheckoutDialog'

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectSubtotal)
  const itemCount = useSelector(selectTotalItems)
  const discount = useSelector(selectDiscount)
  const taxAmount = useSelector(selectTaxAmount)
  const grandTotal = useSelector(selectGrandTotal)

  const [showCheckout, setShowCheckout] = useState(false)
  return (
    <>
        <Card classname="h-full flex flex-col">
          <CardHeader classname="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Orders</CardTitle>
              <Badge>{itemCount} items </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">
                  Cart is empty.
                </p>
              </div>
            ) : (
              <>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div className="flex items-center gap-3 p-3 border rounded-lg" key={item.id}>
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {/* <span className="text-xs font-medium">{item.name.slice(0, 2)}</span> */}
                      <img src={`http://localhost:5000${item.image}`} alt={item.name.slice(0,2)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.price.toLocaleString('en-PH', {style: 'currency', currency: 'PHP'})}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                      className={`p-1 border rounded cursor-pointer disabled:opacity-50`}
                      onClick={() => dispatch(updateQty({ productId: item.id, qty: item.qty - 1}))}
                      disabled={item.qty <= 1}
                      >
                        <Minus size={16}/>
                      </button>

                      {/* <span className="w-8 text-center font-medium">
                        {item.qty}
                      </span> */}

                      <input 
                      type="text" 
                      className='w-8 text-center font-medium'
                      value={item.qty}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if(!isNaN(value) && value > 0) {
                          dispatch(updateQty({productId: item.id, qty: value}))
                        }
                      }}
                      />

                      <button 
                      className={`p-1 border rounded cursor-pointer`}
                      onClick={() => dispatch(updateQty({ productId: item.id, qty: item.qty + 1}))}
                      >
                        <Plus size={16}/>
                      </button>

                      <button 
                      className={`p-1 border rounded cursor-pointer bg-red-500 text-white`}
                      onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{subtotal.toLocaleString('en-PH', {style: 'currency', currency: 'PHP'})}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (12%) :</span>
                    <span>{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount: </span>
                    <span>{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{grandTotal.toLocaleString('en-PH', {style: 'currency', currency: 'PHP'})}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                  className="flex items-center px-4 py-2 border rounded shadow bg-[#0F172A] text-white disabled:opacity-50 cursor-pointer"
                  onClick={() => setShowCheckout(true)}
                  disabled={items.length === 0}
                  >
                    <Receipt size={18} className='mr-2'/>
                    Checkout
                  </button>

                  <button 
                  className="flex items-center px-4 py-2 border rounded shadow bg-red-500 text-white disabled:opacity-50 cursor-pointer"
                  onClick={() => dispatch(clearCart())}
                  >
                    <Trash2 size={18} className='mr-2'/>
                    Clear
                  </button>
                </div>
              </div>
              </>

              
            )}
          </CardContent>
        </Card>

        <CheckoutDialog 
          open={showCheckout}
          onOpenChange={setShowCheckout}
          onComplete={() => {
            setShowCheckout(false)
            dispatch(clearCart())
          }}
        />
    </>
  )
}
