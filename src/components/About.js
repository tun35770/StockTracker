import { Link } from "react-router-dom"

const About = ( {homePath} ) => {
  return (
    <div>
        <h4>Verson 1.0.0</h4>
        <Link to={homePath}>Go Back</Link>
    </div>
  )
}

export default About