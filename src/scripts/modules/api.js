export class Api {
    static baseUrl  = `https://m2-rede-social.herokuapp.com/api`
    static getToken = localStorage.getItem('userTokenKenzie')
    static getId    = localStorage.getItem('userIdKenzie')
    
    static async logUser(data) {
        const userRequired = await fetch(`${this.baseUrl}/users/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: data
        })
        .then(res => res.json())
        .then(res => {
            localStorage.setItem('userTokenKenzie', res.token)
            localStorage.setItem('userIdKenzie', res.user_uuid)
            return res
        })
        .catch(err => console.log(err))
        return userRequired
    }

    static async registerUser(data) {
        const userRequired = await fetch(`${this.baseUrl}/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: data
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async searchUser(token = this.getId) {
        const userRequired = await fetch(`${this.baseUrl}/users/${token}/`,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            }
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }  

    static async allUsers(page) {
        const userRequired = await fetch(`${this.baseUrl}/users/?limit=10&offset=${page}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            }
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async followUser(tokenUserFollow) {
        const userRequired = await fetch(`${this.baseUrl}/users/follow/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            },
            body: tokenUserFollow
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async unfollowUser(tokenUserUnfollow) {
        const userRequired = await fetch(`${this.baseUrl}/users/unfollow/${tokenUserUnfollow}/`,{
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            }
        })
        .then(res => res)
        .catch(err => console.log(err))

        return userRequired
    }

    static async allPosts(page) {
        const userRequired = await fetch(`${this.baseUrl}/posts/?limit=10&offset=${page}`, {
            method: "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            }
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async createPost(data) {
        const userRequired = await fetch(`${this.baseUrl}/posts/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async Like(data) {
        const userRequired = await fetch(`${this.baseUrl}/likes/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(err => console.log(err))

        return userRequired
    }

    static async Unlike(idPost) {
        const userRequired = await fetch(`${this.baseUrl}/likes/${idPost}/`, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Token ${this.getToken}`
            }
        })
        .then(res => res)
        .catch(err => console.log(err))

        return userRequired
    }
}

export class treatmentApi {
    static modal(text,color = 'black',bgColor = '#77ff51',time = 2000) {
        Toastify({
            text       : `${text}`,
            duration   : `${time}`,
            close      : true,
            gravity    : "top",
            position   : "right",
            stopOnFocus: true,
            style      : {
                background: `${bgColor}`,
                color     : `${color}`
            },
            offset: {
                x: '2em', 
                y: '5em' 
              }
        }).showToast();
    }

    static modalConfirm(title,text,icon = "warning") {
        return swal({
            title: `${title}`,
            text: `${text}`,
            icon: `${icon}`,
            buttons: true,
            dangerMode: true,
          })
    }
}

