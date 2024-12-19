const express = require('express');
const router = express.Router();
const usercontroller=require('../controller/usercontroller')
 const categorycontroller=require('../controller/categorycontroller')
const { upload } = require('../middleware/imageupload');
const productcontroller=require('../controller/productcontroller')

 const cartController=require('../controller/cartcontroller')
 const promocodecontroller=require('../controller/promocodecontroller')


router.post('/register',usercontroller.registerUser);
router.post('/login',usercontroller.loginUser)
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
// router.get('/subcategory-list',categorycontroller.subcategoryList)


// router.post('/add-company',companyController.addCompany)
// router.get('/get-company',companyController.getCompanyList)
// router.delete('/delete-company',companyController.deleteCompany)
// router.post('/add-item',upload,itemController.createMenuItem)
// router.get('/get-all-item',itemController.getAllMenuItems)
// router.get('/item-by-id',itemController.getMenuItemById)
// router.delete('/delete-item',itemController.deleteMenuItemById)

// router.post('/add-cart',cartController.addMultipleToCart)
// router.get('/my-cart',cartController.getCartByUserId)


// router.post('/add-banner', upload,bannerController.addBanner)
// router.get('/get-banner',bannerController.bannerList)

// router.post('/order-place',orderController.createOrder)
// router.get('/order-list',orderController.orderList)
// router.get('/order-insight',orderController.orderInsight)
// router.get('/my-order',orderController.myOrder)
// router.get('/get-order-by-company',orderController.getAllCompaniesWithOrderCount)
// router.get('/export-orders', orderController.exportOrders  );
// router.get('/deliverydate', orderController.getOrderCountByDeliveryDate);
// router.get('/order-status', orderController.updateOrderStatusByCompanyAndDate);


// router.post('/feedback',feedbackController.Feedback)
// router.get('/feedback-list',feedbackController.feedbackList)

// router.post('/coupan-generate',coupanController.createCoupon)
// router.get('/coupan-list',coupanController.getCoupons)
// router.delete('/delete-coupan',coupanController.deleteCoupon)

// router.post('/add-reward',upload,rewardController.createReward)
// router.get('/reward-list',rewardController.getAllRewards)
// router.delete('/delete-reward',rewardController.deleteReward)

// router.post('/admin-login',admincontroller.login)
// router.post('/admin-forgot-password',admincontroller.forgotPassword)
// router.post('/admin-verify-code',admincontroller.verifyCode)
// router.post('/admin-reset-password',admincontroller.resetPassword)

// router.post('/qr-send-email',qrcontroller.createAndSendQRCode)

// router.post('/add-customize-meal',upload,customizemealController.createCustomizeMeal)
// router.get('/get-customize-meal',customizemealController.getAllCustomizeMeals)
// router.delete('/delete-customize-meal',customizemealController.deleteCustomizeMeal)
// router.get('/get-customizemeal-by-companyId',customizemealController.getCustomizeMealsByCompany)

// router.post('/add-extrameal',upload,extramealController.addExtraMeal)
// router.get('/get-extrameal',extramealController.getExtraMeals)

router.post('/add-promocode',promocodecontroller.addPromocode)
router.get('/get-promocode',promocodecontroller.getAllPromocodes)
router.delete('/delete-promocode',promocodecontroller.deletePromocode)
router.post('/update-promocode',promocodecontroller.updatePromocode)


module.exports = router;