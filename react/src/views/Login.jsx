import {Link} from "react-router-dom";

export default function Login(){

    const onSubmit =(ev)=>{
        ev.preventDefault()
    }

    return (
        <div>
            <div>
                <form onSubmit={onSubmit}>
                    <h1>Ulogujte se u svoj nalog!</h1>
                    <input type="username" placeholder="Korisničko ime" />
                    <input type="password" placeholder="Šifra" />
                    <button>Login</button>
                    <p>
                        Nemate nalog? <Link to="/register">Napravite svoj nalog!</Link>
                    </p>
                </form>
            </div>
        </div>
    )

}