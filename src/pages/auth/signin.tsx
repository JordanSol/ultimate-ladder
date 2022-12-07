import { type Provider } from "next-auth/providers"
import { getProviders, signIn } from "next-auth/react"
import {type FC, useEffect} from 'react'
import {useRouter} from 'next/router'
import { useSession } from "next-auth/react";


interface SignInType {
    providers: Provider
}

const SignIn: FC<SignInType> = ({ providers }) => {
    const {data: session} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.user) {
            router.push("/")
        }
    })
    return (
        <div className='w-full h-full grow flex items-center justify-center'>
        {Object.values(providers).map((provider) => (
            <div key={provider.name}>
            <button className='btn btn-md btn-accent' onClick={() => {
                signIn(provider.id)
                }}>
                Sign in with {provider.name}
            </button>
            </div>
        ))}
        </div>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default SignIn