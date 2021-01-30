class UserController {
    create(request, response) {
        return response.status(400).json('123')
    }
}

export default new UserController();