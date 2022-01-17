import { getProviders, signIn } from "next-auth/react";
import Image from 'next/image'
function Login({ providers }) {
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
            <Image className="w-52 mb-5" src="/spotify-logo.png" alt="me" width="150" height="150" />
            {/* <img className="w-52 mb-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png" alt="spotify-logo" /> */}
            {/* <img className="w-52 mb-5" src="../public/spotify.jpg" alt="spotify-logo" /> */}
            {/* <button className="bg-[#18D860] text-white p-5 rounded-lg">TEST</button> */}
            {Object.values(providers).map((provider) => {
                return (
                <div key={provider.name}>
                    <button className="bg-[#18D860] text-white p-5 rounded-lg"
                    onClick={() => signIn(provider.id, {callbackUrl: "/"})}
                    >
                        Login with {provider.name}
                    </button>
                </div>
                )
            })}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers,
        },
    };
}
