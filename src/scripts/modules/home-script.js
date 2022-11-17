import {Api,treatmentApi} from "./api.js"

export class homePage {
    static getId = localStorage.getItem('userIdKenzie')
    static posts = []

    static async verifyUser() {
        if (!homePage.getId) {
            localStorage.removeItem('userIdKenzie')
            localStorage.removeItem('userTokenKenzie')
            location.replace('/index.html')
        }
    }

    static logout() {
        const button = document.querySelector(".desactive")
        button.addEventListener("click", () => {
            treatmentApi.modalConfirm("Você tem certeza?", "Se você sair, não ficará por dentro do conteúdo da nossa rede!")
                .then((willDelete) => {
                    if (willDelete) {
                        localStorage.removeItem('userIdKenzie')
                        localStorage.removeItem('userTokenKenzie')
                        location.replace('/index.html')
                    }
                });
        })
    }

    static async renderPerfilInfo() {
        const imgUser = document.getElementById("img__user")
        const followUser = document.getElementById("followers__user")
        const nameUser = document.getElementById("name__user")
        const workUser = document.getElementById("work__user")
        const {image,username,work_at,followers_amount} = await Api.searchUser()
        imgUser.src = image
        nameUser.innerText = username
        workUser.innerText = work_at
        followUser.innerText = `${followers_amount} Seguidores`
    }

    static async reloadFollows() {
        const buttonReload = document.querySelector("#reload__followers")
        
        buttonReload.addEventListener("click", () => {
            const atualFollowers = document.querySelectorAll(".aside__content li")
            homePage.renderFollow()
            setTimeout(() => {
                atualFollowers.forEach(elem => elem.remove())
            },1800)
        })
        
    }
    
    static reloadListPost() {
        const reloadList = document.querySelector("#reload__posts")
        
        reloadList.addEventListener("click", () => {
            const atualList = document.querySelectorAll(".posts__users li")
            homePage.renderPosts()
            setTimeout(() => {
                atualList.forEach(elem => elem.remove())
            },1800)
            homePage.openPostModal()
        })
    }

    static async followUser() {
        const listaFollowers = document.querySelector(".aside__content")
        listaFollowers.addEventListener("click", async (e) => {
            if(e.target.tagName == "BUTTON") {
                const isFollow    = e.target.classList.contains("button__isFollow")
                e.target.classList.toggle("button__isFollow")
                e.target.classList.toggle("button__notFollow")
                e.target.innerText = isFollow ? 'Seguir' : 'Seguindo'
                const idFollowing = e.target.closest("li").id
                const bodyRequest = {following_users_uuid: idFollowing}
                let idIntoUserFollow = ''
                let arr = await Api.searchUser(idFollowing)
                arr.followers.forEach(elem => {
                    if(elem.followers_users_id.uuid == homePage.getId) {
                        idIntoUserFollow = elem.uuid
                    }
                })
                isFollow ? await Api.unfollowUser(idIntoUserFollow) : await Api.followUser(JSON.stringify(bodyRequest))
            }
        })
    }

    static async renderFollow() {
        const {count} = await Api.allUsers()
        const arrayId = []
        const isFollowing = await Api.searchUser(homePage.getId)
        let countUsers = 0

        while (arrayId.length < 3) {
            countUsers++
            const usersRandom = Math.floor(Math.random() * 10)
            const pagesRandom = Math.floor(Math.random() * count - 11)
            const {results} = await Api.allUsers(pagesRandom)
            const {uuid} = results[usersRandom]
            if (arrayId.includes(uuid) || arrayId.includes(homePage.getId)) {
                countUsers--
            } else {
                arrayId.push(uuid)
            }
        }

        arrayId.forEach(async (elem) => {
            const listContainer = document.querySelector(".aside__content")
            const {image,username,work_at,uuid} = await Api.searchUser(elem)
            const isFollow = await isFollowing.following.some(elemento => elemento.following_users_id.uuid == elem)

            const container = document.createElement("li")
            container.className = "aside__users"
            container.id = uuid
            container.style.animation = "openingModal 0.7s ease-in-out"

            const containerContent = document.createElement("div")
            containerContent.className = "aside__users--info"

            const imgContent = document.createElement("img")
            imgContent.alt = 'Perfil image'

            if (image.includes('http')) {
                imgContent.src = image
            } else {
                imgContent.src = `http://franquia.globalmedclinica.com.br/wp-content/uploads/2016/01/investidores-img-02-01.png`
            }

            const perfilDiv = document.createElement("div")

            const pName = document.createElement("p")
            pName.classList.add("color-grey-1", "font-title-3")
            pName.innerText = username

            const pWork = document.createElement("p")
            pWork.classList.add("color-grey-2", "font-text-2")
            pWork.innerText = work_at

            perfilDiv.append(pName, pWork)
            containerContent.append(imgContent, perfilDiv)

            const containerButtons = document.createElement("div")
            containerButtons.classList.add("aside__users--button")

            const button = document.createElement("button")
            button.classList.add("radius3")
            if (await isFollow) {
                button.innerText = 'Seguindo'
                button.classList.add("button__isFollow")
            } else {
                button.innerText = 'Seguir'
                button.classList.add("button__notFollow")
            }

            containerButtons.appendChild(button)
            container.append(containerContent, containerButtons)
            listContainer.append(container)
        })
    }

    static async verifyLike(arrayLike) {
        return arrayLike.some(elem => elem.user.uuid == homePage.getId)
    }

    static async renderPosts() {
        const listaPosts = document.querySelector(".posts__users")
        const Arraycount = await Api.allPosts(1)
        const requiredPosts = await Api.allPosts(Arraycount.count-9)
        homePage.posts = requiredPosts
        const {results} = requiredPosts
        
        results.reverse().forEach( async (post) => {
            const {uuid,title,description,likes,author:{username,image,work_at}} = post
            const like = await homePage.verifyLike(likes)
            
            const container = document.createElement("li")  
            container.className = "posts__users--card"
            container.id = uuid
            container.style.animation = "leftToRight 0.7s ease-in-out"
    
            const divPerfil = document.createElement("div")
            divPerfil.className = "posts__users--perfil"
    
            const imgPerfil = document.createElement("img")
            imgPerfil.src = image

            const divInternPerfil = document.createElement("div")
            divInternPerfil.className = "post__users--infoUser"

            const divInternPerfilH2 = document.createElement("h2")
            divInternPerfilH2.classList.add("color-grey-1","font-title-3")
            divInternPerfilH2.innerText = username

            const divInternPerfilP = document.createElement("p")
            divInternPerfilP.classList.add("font-text-2","color-grey-2")
            divInternPerfilP.innerText = work_at

            divInternPerfil.append(divInternPerfilH2,divInternPerfilP)
            divPerfil.append(imgPerfil,divInternPerfil)

            const titlePostH2 = document.createElement("h2")
            titlePostH2.classList.add("font-title-2")
            titlePostH2.id = "title__post"
            titlePostH2.innerText = title

            const descriptionPost = document.createElement("p")
            descriptionPost.classList.add("color-grey-2")
            descriptionPost.id = `text__post`
            descriptionPost.innerText = description

            const divButtons = document.createElement("div")
            divButtons.classList.add("posts__buttons")

            const buttonOpenPost = document.createElement("button")
            buttonOpenPost.classList.add("color-white","bg-color-grey-1","radius3")
            buttonOpenPost.innerText = 'Abrir Post'
            buttonOpenPost.setAttribute('data-modal-control',"close__post")
            
            const buttonDivIntern = document.createElement("div")

            const buttonHearth = document.createElement("img")

            if(like) {
                buttonHearth.src = '../assets/heartRed.png'
                buttonHearth.className = 'isLike'
            } else {
                buttonHearth.src = '../assets/heartBlack.png'
                buttonHearth.className = 'isUnlike'
            }
            
            const buttonQuantity = document.createElement("span")
            buttonQuantity.innerText = likes.length

            buttonDivIntern.append(buttonHearth,buttonQuantity)
            divButtons.append(buttonOpenPost,buttonDivIntern)
            container.append(divPerfil,titlePostH2,descriptionPost,divButtons)

            listaPosts.appendChild(container)

        })
    }

    static createPost() {
        const postForm = document.querySelector(".post__form")
        const textArea = document.querySelectorAll(".post__form textarea")
        
        postForm.addEventListener("submit", async (e) => {
            e.preventDefault()
            const data = {}
            textArea.forEach(text => {
                data[text.name] = text.value
            })
            
            const required = await Api.createPost(data)
            if(required.uuid) {
                const atualList = document.querySelectorAll(".posts__users li")
                treatmentApi.modal('Sua publicação foi postada!')
                homePage.renderPosts()
                setTimeout(() => {
                    atualList.forEach(elem => elem.remove())
                },1800)
                setTimeout(() => {
                    homePage.openPostModal()
                },1800)
                textArea[0].value = ''
                textArea[1].value = ''
            } else {
                treatmentApi.modal('Ocorreu algum erro!','black','rgb(255, 139, 139)',5000)
            }
        })
    }

    static openPostModal() {
        setTimeout(() => {
            const buttonPost = document.querySelectorAll("[data-modal-control]")
            const infoModal = document.querySelectorAll(".modal__info")
            const modal = document.querySelector(".modal__post--bg")
            const array = homePage.posts.results
            const outAnimation = document.querySelector(".modal__post--extern")
            
        
            buttonPost.forEach(button => button.addEventListener('click', (e) => {
                modal.classList.toggle("hidden")
                outAnimation.style.animation = `leftToRight 0.7s ease-in`
                const lista = e.target.closest("li")
                const post = array.find(elem => elem.uuid == lista.id)
                const {description,title,author:{username},author:{work_at},author:{image}} = post
                
                infoModal[0].src = image
                infoModal[1].innerText = username
                infoModal[2].innerText = work_at
                infoModal[3].innerText = title
                infoModal[4].innerText = description
            }))
        },10000)   
    }

    static closeModalText() {
        const outAnimation = document.querySelector(".modal__post--extern")
        const containerModal = document.querySelector(".modal__post--bg")
        const modalClosed = document.querySelector(".modal__post--bg")
        containerModal.addEventListener("click", (e) => {
            if(e.target.id == "button__closed") {
                outAnimation.style.animation = 'leftToRightInverse 0.7s ease-in'
                setTimeout(() => {
                    modalClosed.classList.toggle("hidden")
                },600)
            }
        })
    }

    static likePost() {
        const listaFollowers = document.querySelector(".posts__users")
        listaFollowers.addEventListener("click", async (e) => {
            const idPost = e.target.closest("li").id
            if(e.target.className == "isUnlike") {
                e.target.src = "../assets/heartRed.png"
                e.target.className = "isLike"
                const required = {post_uuid : idPost}
                await Api.Like(required)
                e.target.nextSibling.innerText++
            } else if(e.target.className == "isLike") {
                e.target.src = "../assets/heartBlack.png"
                e.target.className = "isUnlike"
                let like = false
                const arr = homePage.posts.results
                arr.forEach(elem => {
                    elem.likes.some(likes => {
                        if(likes.user.uuid == homePage.getId) {
                            like = likes.uuid
                        }
                    })
                })
                await Api.Unlike(like)
                e.target.nextSibling.innerText--
            }


        })
    }

}