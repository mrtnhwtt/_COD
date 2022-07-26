const User = require('../../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

exports.getById = async (req, res, next) => {
    const { id } = req.params;

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json({ 'message': 'user_not_found' });
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.add = async (req, res, next) => {
    const temp = {};

    ({
        name: temp.name,
        firstname: temp.firstname,
        email: temp.email,
        password: temp.password
    } = req.body);

    Object.keys(temp).forEach((key) => (temp[key] == null) && delete temp[key]);

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const temp = {};

    ({
        name: temp.name,
        firstname: temp.firstname,
        email: temp.email,
        password: temp.password
    } = req.body);

    try {
        let user = await User.findOne({ email: temp.email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json({ 'message': 'user_not_found' });
    } catch (error) {
        console.log(error)
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const { id } = req.body;

    try {
        await User.deleteOne({ _id: id });

        return res.status(201).json({ 'message': 'delete_ok' });
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.auth = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, function (err, response) {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                        SECRET_KEY,
                        {
                            expiresIn: expireIn
                        });

                    res.header('Authorization', 'Bearer ' + token);

                    return res.status(200).json(user);
                }

                return res.status(403).json({ 'message': 'wrong_credentials' });
            });
        } else {
            return res.status(404).json({ 'message': 'user_not_found' });
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}