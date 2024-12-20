const express = require('express');
const router = express.Router();
const usercontroller=require('../controller/usercontroller')
 const categorycontroller=require('../controller/categorycontroller')
const { upload } = require('../middleware/imageupload');
const productcontroller=require('../controller/productcontroller')

 const cartController=require('../controller/cartcontroller')
 const promocodecontroller=require('../controller/promocodecontroller')
 const bannerController=require('../controller/bannercontroller')
 const sliderController=require('../controller/slidercontroller')


router.post('/register',usercontroller.registerUser);
router.post('/login',usercontroller.loginUser)
router.post('/admin-login',usercontroller.adminlogin)
router.get('/user-list',usercontroller.getAllUsers)
router.delete('/delete-user',usercontroller.deleteUser)
router.get('/export-users', usercontroller.exportUsersToExcel);
router.post('/update-user',usercontroller.updateUser)
router.get('/get-user-detail',usercontroller.Userdetail)

 router.post('/add-category',upload,categorycontroller.addCategory)
 router.post('/add-subcategory', upload,categorycontroller.addSubcategory)
 router.get('/get-category',categorycontroller.CategoryList)
 router.post('/update-category',upload,categorycontroller.updateCategory)
 router.delete('/delete-category',categorycontroller.deletedCategory)


 router.post('/add-product',upload,productcontroller.addProduct)
 router.get('/get-product',productcontroller.getProducts)
 router.post('/update-product',upload,productcontroller.updateProduct)
 router.delete('/delete-product',productcontroller.deleteProduct)

 router.get('/get-categorybyId',productcontroller.getProductsByCategory)
 router.post('/add-to-cart',cartController.addToCart)






 router.post('/add-banner', upload,bannerController.addBanner)
 router.get('/get-banner',bannerController.bannerList)
 router.post('/update-banner',upload,bannerController.updateBanner)
 router.delete('/delete-banner',bannerController.deleteBanner)

 router.post('/add-slider',upload,sliderController.addSlider)
 router.get('/get-slider',sliderController.sliderlist)
 router.post('/update-slider',upload,sliderController.updateSlider)
 router.delete('/delete-slider',sliderController.deleteSlider)




router.post('/add-promocode',promocodecontroller.addPromocode)
router.get('/get-promocode',promocodecontroller.getAllPromocodes)
router.delete('/delete-promocode',promocodecontroller.deletePromocode)
router.post('/update-promocode',promocodecontroller.updatePromocode)


module.exports = router;