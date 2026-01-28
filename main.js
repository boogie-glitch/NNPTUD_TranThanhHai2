async function LoadData() {
    try {
        let response = await fetch("http://localhost:3000/posts")
        let posts = await response.json()
        let body = document.getElementById("table-body")
        body.innerHTML = ""
        for (const post of posts) {
            let innerHTML = "";
            let viewCount = post.view || post.views || 0;
            let deleteRestoreBtn = post.isDelete 
                ? `<button class="btn-restore" onclick="Restore(${post.id})">Restore</button>`
                : `<button class="btn-delete" onclick="Delete(${post.id})">Delete</button>`;
            
            innerHTML += `<tr class="${post.isDelete ? 'deleted' : ''}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${viewCount}</td>
                <td>
                    <button class="btn-edit" onclick="Edit(${post.id})">Edit</button>
                    ${deleteRestoreBtn}
                </td>
            </tr>`
            body.innerHTML += innerHTML
        }
    }
    catch (error) {
        console.error("Error fetching data:", error)
    }
}

async function Save() {
    try {
        let title = document.getElementById("text-title").value
        let view = document.getElementById("text-view").value
        let id = document.getElementById("text-id").value

        if (id) {
            // Update existing post
            let response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    view: view
                })
            })
        } 
        else {
            // Create new post with auto-increment ID
            let allPostsResponse = await fetch("http://localhost:3000/posts")
            let allPosts = await allPostsResponse.json()
            
            // Find max ID
            let maxId = 0
            for (const post of allPosts) {
                let postId = parseInt(post.id)
                if (postId > maxId) {
                    maxId = postId
                }
            }
            
            let newId = (maxId + 1).toString()

            let response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId,
                    title: title,
                    view: view
                })
            })
        }
        LoadData()
        document.getElementById("text-id").value = ""
        document.getElementById("text-title").value = ""
        document.getElementById("text-view").value = ""
    }
    catch (error) {
        console.error("Error saving data:", error)
    }
}

async function Delete(id) {
    try {
        let getResponse = await fetch(`http://localhost:3000/posts/${id}`)
        if (!getResponse.ok) {
            return
        }

        let post = await getResponse.json()
        post.isDelete = true
        let response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(post)
        })
        LoadData()
    }
    catch (error) {
        console.error("Error deleting data:", error)
    }
}

async function Restore(id) {
    try {
        let getResponse = await fetch(`http://localhost:3000/posts/${id}`)
        if (!getResponse.ok) {
            return
        }

        let post = await getResponse.json()
        post.isDelete = false
        let response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(post)
        })
        LoadData()
    }
    catch (error) {
        console.error("Error restoring data:", error)
    }
}

async function Edit(id) {
    try {
        let response = await fetch(`http://localhost:3000/posts/${id}`)
        if (!response.ok) {
            return
        }

        let post = await response.json()
        document.getElementById("text-id").value = post.id
        document.getElementById("text-title").value = post.title
        let viewCount = post.view || post.views || 0
        document.getElementById("text-view").value = viewCount
    }
    catch (error) {
        console.error("Error loading post data:", error)
    }
}

// Comments Functions
async function LoadComments() {
    try {
        let response = await fetch("http://localhost:3000/comments")
        let comments = await response.json()
        let body = document.getElementById("comments-table-body")
        body.innerHTML = ""
        for (const comment of comments) {
            let deleteRestoreBtn = comment.isDelete 
                ? `<button class="btn-restore" onclick="RestoreComment(${comment.id})">Restore</button>`
                : `<button class="btn-delete" onclick="DeleteComment(${comment.id})">Delete</button>`;
            
            innerHTML = `<tr class="${comment.isDelete ? 'deleted' : ''}">
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>
                    <button class="btn-edit" onclick="EditComment(${comment.id})">Edit</button>
                    ${deleteRestoreBtn}
                </td>
            </tr>`
            body.innerHTML += innerHTML
        }
    }
    catch (error) {
        console.error("Error fetching comments:", error)
    }
}

async function SaveComment() {
    try {
        let text = document.getElementById("comment-text").value
        let postId = document.getElementById("comment-postId").value
        let id = document.getElementById("comment-id").value

        if (!text || !postId) {
            alert("Please fill in all fields")
            return
        }

        if (id) {
            // Update existing comment
            let response = await fetch(`http://localhost:3000/comments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text,
                    postId: postId
                })
            })
        } 
        else {
            // Create new comment with auto-increment ID
            let allCommentsResponse = await fetch("http://localhost:3000/comments")
            let allComments = await allCommentsResponse.json()
            
            // Find max ID
            let maxId = 0
            for (const comment of allComments) {
                let commentId = parseInt(comment.id)
                if (commentId > maxId) {
                    maxId = commentId
                }
            }
            
            let newId = (maxId + 1).toString()

            let response = await fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId,
                    text: text,
                    postId: postId
                })
            })
        }
        LoadComments()
        document.getElementById("comment-id").value = ""
        document.getElementById("comment-text").value = ""
        document.getElementById("comment-postId").value = ""
    }
    catch (error) {
        console.error("Error saving comment:", error)
    }
}

async function DeleteComment(id) {
    try {
        let getResponse = await fetch(`http://localhost:3000/comments/${id}`)
        if (!getResponse.ok) {
            return
        }

        let comment = await getResponse.json()
        comment.isDelete = true
        let response = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
        })
        LoadComments()
    }
    catch (error) {
        console.error("Error deleting comment:", error)
    }
}

async function RestoreComment(id) {
    try {
        let getResponse = await fetch(`http://localhost:3000/comments/${id}`)
        if (!getResponse.ok) {
            return
        }

        let comment = await getResponse.json()
        comment.isDelete = false
        let response = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
        })
        LoadComments()
    }
    catch (error) {
        console.error("Error restoring comment:", error)
    }
}

async function EditComment(id) {
    try {
        let response = await fetch(`http://localhost:3000/comments/${id}`)
        if (!response.ok) {
            return
        }

        let comment = await response.json()
        document.getElementById("comment-id").value = comment.id
        document.getElementById("comment-text").value = comment.text
        document.getElementById("comment-postId").value = comment.postId
    }
    catch (error) {
        console.error("Error loading comment data:", error)
    }
}

LoadData();
LoadComments();