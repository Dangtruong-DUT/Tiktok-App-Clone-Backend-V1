
export const loginValidator = (req: any, res: any, next: any) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password.' })
    }
    next()
}
