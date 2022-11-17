import {Api, treatmentApi} from "./api.js"

export class register {
    static changeToLogin() {
        const buttonLogin = document.querySelectorAll("[data-modal-register]")
        buttonLogin.forEach(button => button.addEventListener('click', () => {
            location.replace('/index.html')
        }))
    }

    static async registerUser() {
        const modalError      = document.querySelector(".modal__invalid--userLogin")
        const closeModal      = document.querySelector("#closed__modal--error")
        const modalIntern     = document.querySelector(".modal__userLogin")
        const formRegisterInput = document.querySelectorAll("#form__register input")
        const formRegister      = document.querySelector("#form__register")

        let dataUser = {}
        formRegister.addEventListener("submit", async (event) => {
            event.preventDefault()
            formRegisterInput.forEach(input => {
                dataUser[input.name] = input.value
            })
            
            const required = await Api.registerUser(JSON.stringify(dataUser))
            if(required.uuid) {
                treatmentApi.modal('Cadastrado com sucesso')
                setTimeout(() => {
                    location.replace("../../index.html")
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