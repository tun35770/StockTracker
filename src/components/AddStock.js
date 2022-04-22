import { useState } from 'react'

const AddStock = ({ onAdd }) => {
    const [text, setText] = useState('')
    const [price, setPrice] = useState('')
    const [active, setActive] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!text){
            alert('Please add a stock')
            return
        }

        onAdd({ text, price, active})

        setText('')
        setPrice('')
        setActive(false)
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Stock</label>
                <input type='text' placeholder='Add Stock' value={text} onChange={(e) => setText(e.target.value)}/>
            </div>
            <div className='form-control'>
                <label>Price</label>
                <input type='text' placeholder='Add Price' value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <div className='form-control form-control-check'>
                <label>Set Active</label>
                <input type='checkbox' checked={active} value={active} onChange={(e) => setActive(e.currentTarget.checked)}/>
            </div>

            <input type='submit' value='Save Stock' className='btn btn-block' />
        </form>
    )
}

export default AddStock