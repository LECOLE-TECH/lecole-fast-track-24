import { ActionDialog } from "~/types/interface"
import { Button } from "../../../components/ui/button"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog"
import { LoginForm } from "./login-form"
import { LoginUser, RegisterUser, SecretUser } from "~/utils/schema"
import { RegisterForm } from "./register-form"
import { useRegisterUser } from "~/hooks/users/userRegisterUser"
import { useLoginUser } from "~/hooks/users/useLoginUser"
import { Link } from "react-router"
import { useStore } from "~/store"
import { SecretForm } from "./secret-form"
import { useSocket } from "~/hooks/useSocket"
import { encryptMessage } from "~/utils/cryptography"
import { toast } from "react-toastify"
import { User } from "~/types/users.types"

const Header = () => {
  const [actionDialog, setActionDialog] = useState<ActionDialog>(
    ActionDialog.DEFAULT
  )
  const user = useStore((state) => state.user)
  const { mutate: register } = useRegisterUser()
  const { mutate: login } = useLoginUser()
  const { socket } = useSocket()
  const setUser = useStore((state) => state.setUser)

  const handleLogin = async (data: LoginUser) => {
    login(data)
    setActionDialog(ActionDialog.DEFAULT)
  }

  const handleRegister = (data: RegisterUser) => {
    register(data)
    setActionDialog(ActionDialog.DEFAULT)
  }

  const handleChangeSecret = ({ secret }: SecretUser) => {
    const data = {
      id: user?.id!,
      secret
    }
    if (socket) {
      const encryptedData = encryptMessage(data)
      socket.emit("update-user", encryptedData)
      setUser({ ...user, secret } as User)
      toast.success("Secret has been updated successfully")
      return setActionDialog(ActionDialog.DEFAULT)
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("update-user-response", (_: string) => {
        console.log("User has been updated successfully")
      })
    }
    return () => {
      socket?.off("update-user-response")
    }
  }, [socket])

  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="flex flex-wrap justify-between max-w-screen-2xl items-center mx-auto">
            <Link
              to={"/"}
              className="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
            >
              Lecole AI
            </Link>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button
                    className="interceptor-loading"
                    onClick={() => {
                      setActionDialog(ActionDialog.CHANGE_SECRET)
                    }}
                  >
                    Change Your Secret
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="interceptor-loading"
                    onClick={() => {
                      setActionDialog(ActionDialog.REGISTER)
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    className="interceptor-loading"
                    onClick={() => {
                      setActionDialog(ActionDialog.LOGIN)
                    }}
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {!!actionDialog && (
        <Dialog
          open={!!actionDialog}
          onOpenChange={() => setActionDialog(ActionDialog.DEFAULT)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center">
                {actionDialog === ActionDialog.REGISTER
                  ? "Register"
                  : actionDialog === ActionDialog.LOGIN
                  ? "Login"
                  : "Change Your Secret"}
              </DialogTitle>
              {actionDialog === ActionDialog.REGISTER ? (
                <DialogDescription className="text-center">
                  Register to access all the features of Lecole AI
                </DialogDescription>
              ) : actionDialog === ActionDialog.LOGIN ? (
                <DialogDescription className="text-center">
                  Login to access all the features of Lecole AI
                </DialogDescription>
              ) : (
                <DialogDescription className="text-center">
                  Change your secret to keep your account secure
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="mt-4">
              {actionDialog === ActionDialog.LOGIN ? (
                <LoginForm onLogin={handleLogin} />
              ) : actionDialog === ActionDialog.REGISTER ? (
                <RegisterForm onRegister={handleRegister} />
              ) : (
                <SecretForm
                  onChangeSecret={handleChangeSecret}
                  currentSecret={user?.secret!}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default Header
