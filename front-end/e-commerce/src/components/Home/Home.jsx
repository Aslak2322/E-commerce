import homeImage from '../../assets/mark-konig-Tl8mDaue_II-unsplash.jpg';
import './Home.css';
import menImage from '../../assets/pexels-shotbymeti-9864149.jpg';
import womenImage from '../../assets/pexels-harsh-kushwaha-804217-1689731.jpg';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <div className="category">
                <div className="men">
                  <Link to="/products/men">
                    <h1>Men's Clothes</h1>
                  </Link>
                </div>
                <div className="women">
                  <Link to="/products/women">
                    <h1>Women's Clothes</h1>
                  </Link>
                </div>
            </div>
            <div className="kids">
              <Link to="/products/kids">
                <h1>Kid's Clothes</h1>
              </Link>
            </div>
            <footer>Aslak CO 2025</footer>
        </div>
    )
}

export default Home;