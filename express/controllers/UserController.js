const User = require("../modals/UserModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {

    // [POST] /login
    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const user = await User.findOne({ username });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES }
            );

            res.status(200).json({
                token,
                id: user._id
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // [POST] /sign_in
    async sign_in(req, res) {
        try {
            const { username, password, email } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Username, password and email are required' });
            }

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                password: hashedPassword,
                email
            });

            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // [GET] /get_information/:userID
    async getInformation(req, res) {
        try {
            const { userID } = req.params;

            // Kiểm tra nếu userID không hợp lệ
            if (!userID || !userID.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    message: 'Invalid user ID',
                    status: 400
                });
            }

            const user = await User.findById(userID).select("name email phone image");

            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                    status: 404
                });
            }

            res.status(200).json({
                status: 200,
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Server error',
                status: 500
            });
        }
    }


    // [POST] /change_password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword, userID } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Current and new password are required' });
            }

            const user = await User.findById(userID != null ? userID : req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // [PUT] /update_info
    updateUserInfo = async (req, res, next) => {
        try {
            const { name, email, phone, image, userID } = req.body;

            // Kiểm tra userID
            if (!userID) {
                return res.status(400).json({
                    message: 'User ID is required',
                    status: 400
                });
            }

            // Tạo object update chỉ chứa các trường có giá trị khác undefined
            const updateFields = {};
            if (name !== undefined) updateFields.name = name;
            if (email !== undefined) updateFields.email = email;
            if (phone !== undefined) updateFields.phone = phone;
            if (image !== undefined) updateFields.image = image;

            // Nếu không có gì để update
            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({
                    message: 'No fields provided to update',
                    status: 400
                });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userID,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    message: 'User not found',
                    status: 404
                });
            }

            res.status(200).json({
                message: 'User information updated successfully',
                status: 200,
                data: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    image: updatedUser.image
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Server error',
                status: 500
            });
        }
    };


}

module.exports = new UserController();
