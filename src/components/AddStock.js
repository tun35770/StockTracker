import { useState } from 'react'

const AddStock = ({ onAdd }) => {
    const [ticker, setTicker] = useState('')
    const [isCrypto, setIsCrypto] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!ticker){
            alert('Please add a stock')
            return
        }

        onAdd({ ticker, isCrypto })

        setTicker('')
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Stock Ticker</label>
                <input type='text' placeholder='Add Stock' value={ticker} onChange={(e) => setTicker(e.target.value)}/>
            </div>
            
            <div className='form-control form-control-check'>
                <label>Is Crypto</label>
                <input type='checkbox' value={isCrypto} onChange={e => setIsCrypto(e.target.checked)}/>
            </div>
            <input type='submit' value='Find Stock' className='btn btn-block' />
        </form>
    )
}

export default AddStock