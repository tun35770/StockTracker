import PropTypes from 'prop-types'
import Button from './Button'
import { useLocation } from 'react-router-dom'

const Header = ( {title, onAdd, showAdd, homePath}) => {

  const location = useLocation()

  return (
    <header className='header'>
        <h1>{title}</h1>
        {location.pathname === homePath && <Button color={showAdd ? 'red' : 'green'} 
                text={showAdd ? 'Close' : 'Add'} 
                onClick={onAdd}/>}
    </header>
  )
}

Header.defaultProps = {
    title: 'Stock Tracker'
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

//CSS in JS
// const headingStyle = {
//     color: 'red', backgroundColor: 'black'
// }

export default Header