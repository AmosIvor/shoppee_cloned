import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { Fragment, useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import PATH from 'src/constant/path'
import { PURCHASES_STATUS } from 'src/constant/purchase'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import noproduct from 'src/assets/images/no-product.png'

export default function Cart() {
  // const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  // get purchases to display in cart page
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: PURCHASES_STATUS.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: PURCHASES_STATUS.inCart })
  })
  const purchasesInCart = purchasesInCartData?.data.data

  const location = useLocation()
  const chosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  console.log(location.state)

  const isAllChecked = useMemo(() => {
    return extendedPurchases.every((purchase) => purchase.checked)
  }, [extendedPurchases])
  const checkedPurchases = useMemo(() => {
    return extendedPurchases.filter((purchase) => purchase.checked)
  }, [extendedPurchases])

  const checkedPurchasesCount = checkedPurchases.length

  const totalCheckedPurchasePrice = useMemo(() => {
    return checkedPurchases.reduce((result, current) => {
      return result + current.product.price * current.buy_count
    }, 0)
  }, [checkedPurchases])
  const totalCheckedPurchaseSavingPrice = useMemo(() => {
    return checkedPurchases.reduce((result, current) => {
      return result + (current.product.price_before_discount - current.product.price) * current.buy_count
    }, 0)
  }, [checkedPurchases])

  // update purchases
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  // buy products
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  // delete purchase
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChosenPurchaseIdFromLocation = chosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: Boolean(isChosenPurchaseIdFromLocation || extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, chosenPurchaseIdFromLocation, setExtendedPurchases])

  useEffect(() => {
    console.log('use effect')
    return () => {
      console.log('into replace')
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((prev) => {
        prev[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((prev) => {
          prev[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((prev) => {
        prev[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchasesIds)
  }

  const handleBuyProducts = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <Fragment>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                {/* header */}
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      {/* input */}
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-6 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>

                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>

                {/* body */}
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='mt-3 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            {/* input */}
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-6 accent-orange'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>

                            <div className='flex-grow'>
                              <div className='flex'>
                                {/* image */}
                                <Link
                                  to={`${PATH.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='h-20 w-20 flex-shrink-0'
                                >
                                  <img src={purchase.product.image} alt={purchase.product.name} />
                                </Link>

                                {/* name product */}
                                <div className='flex-grow px-2 pb-2 pt-1'>
                                  <Link
                                    to={`${PATH.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            {/* price product */}
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  đ{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>đ{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>

                            {/* quantity */}
                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value <= purchase.product.quantity &&
                                      value >= 1 &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>

                            {/* total price */}
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>

                            {/* delete and find similar product */}
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDelete(index)}
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* sticky */}
            <div className='sticky bottom-0 z-10 mt-5 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                {/* input */}
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                  />
                </div>

                {/* button choose all */}
                <button className='mx-3 border-none bg-none' onClick={handleCheckedAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>

                {/* button delete */}
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  Xoá
                </button>
              </div>

              {/* total bill */}
              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  {/* first row */}
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm)</div>
                    <div className='ml-2 text-2xl text-orange'>đ{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>

                  {/* second row */}
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>đ{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>

                <Button
                  className='ml-4 mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:mt-0'
                  onClick={handleBuyProducts}
                  disabled={buyProductsMutation.isPending}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24'>
              <img src={noproduct} alt='no-product' className='h-full w-full object-cover' />
            </div>
            <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
            <Link
              to={PATH.home}
              className='mt-5 rounded-sm bg-orange px-10 py-3 uppercase text-white transition-all hover:bg-orange/80'
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
