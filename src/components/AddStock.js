import { useState } from 'react'

const AddStock = ({ onAdd }) => {
    const [ticker, setTicker] = useState('')
    const [price, setPrice] = useState('')
    const [date, setDate] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        if(!ticker){
            alert('Please add a stock')
            return
        }

        onAdd({ ticker })

        setTicker('')
        setPrice('')
        setDate('')
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Stock Ticker</label>
                <input type='text' placeholder='Add Stock' value={ticker} onChange={(e) => setTicker(e.target.value)}/>
            </div>
            
            <input type='submit' value='Find Stock' className='btn btn-block' />
        </form>
    )
}

export default AddStock