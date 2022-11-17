import {Api, treatmentApi} from "./api.js"

export class login {
    static changeToRegister() {
        const buttonRegister = document.querySelectorAll("[data-modal-control]")
        buttonRegister.forEach(button => button.addEventListener('click', () => {
            location.replace('/src/pages/cadastro.html')
        }))
    }

    static async userLogin() {
        const modalError      = document.querySelector(".modal__invalid--userLogin")
        const closeModal      = document.querySelector("#closed__modal--error")
        const modalIntern     = document.querySelector(".modal__userLogin")
        const formularioLogin = document.querySelector("#form__login")
        const formularioInput = document.querySelectorAll("#form__login input")

        formularioLogin.addEventListener('submit', async (e) => {
            e.preventDefault()
            const infoLogin = {}
            formularioInput.forEach(input => {
                infoLogin[input.name] = input.value
            })

            const response = await Api.logUser(JSON.stringify(infoLogin))

            if (response.token) {
                treatmentApi.modal('Logado com sucesso!')
                setTimeout(() => {
                    location.replace('/src/pages/home.html')
                }, 2000)
            } else {
                modalError.classList.toggle("hidden")
                modalIntern.style.animation = `openingModal 0.8s ease`
            }
        })

        closeModal.addEventListener("click", () => {
            modalIntern.style.animation = `closedModal 0.8s ease`
            setTimeout(() => {
                modalError.classList.toggle("hidden")
            },350)
        })
    }
}