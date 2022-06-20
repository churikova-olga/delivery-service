const {Router} = require('express')
const router = Router()
const isLoggedIn = require('../../middleware/auth');
const Advertisement = require("../../models/Advertisement")
const fileMiddleware = require("../../middleware/file")

// не требует аунтефикации просмотр всех объявлений
router.get('/', async function (req, res){
    try {
        const result = await Advertisement.find({isDeleted: false}, {
            isDeleted: 0,
            __v: 0
        }).populate('userId', 'name')
        res.json({data: result, status: 'OK'});
    }catch(e){
        res.json({data: e, status: 'error'});
    }

})

//не требует аунтефикации просмотр одного объявления
router.get('/:id', async function (req, res){
    const {id} = req.params
    try {
        const result = await Advertisement.findOne({_id: id, isDeleted: false}, {
            isDeleted: 0,
            __v: 0
        }).populate('userId', 'name')

        if(result) res.json({data: result, status: 'OK'});
        else res.json({data: 'Такое объяление не существует или удалено', status: 'error'});

    }catch(e){
        res.json({data: e, status: 'error'});
    }

})

//требует аунтефикации (добавление объявления)
router.post('/', isLoggedIn, fileMiddleware.array('images', 12), async function (req, res){
    console.log(req.files)
    if (req.files) {
        let images = []
        for (let i = 0; i < req.files.length; i++) images.push(req.files[i].path)

        const {shortText, description, tags} = req.body;


        try {

            const newAdvertisement = new Advertisement({
                shortText: shortText,
                description: description,
                images: images,
                userId: req.user.id,
                createdAt: Date.now(),
                updatedAt:  Date.now(),
                tags: tags,
            });

            await newAdvertisement.save();
            const result = await Advertisement.findOne({_id: newAdvertisement._id}, {updatedAt: 0, isDeleted: 0, __v: 0}).
            populate('userId', 'name')

            res.json({data: result, status: 'OK'});
        } catch (e) {
            console.error(e);
            res.json({data: e, status: 'error'})
        }
    }
})

//требует аунтефикации (удаление объявления) только владельцем
router.delete('/:id', isLoggedIn, async function (req, res){
    const {id} = req.params
    try {
        const result = await Advertisement.findOne({_id: id, isDeleted: false}, {userId: 1, isDeleted: 1})

        if(result){
            if(result.userId.toString() === req.user.id.toString()){
                console.log(result.isDeleted)
                result.isDeleted = true
                result.save()
                res.json({data: 'Объявление удалено', status: 'OK'})
            }
            else res.json({data: 'Вы не можете удалить объяление, вы не его владелец', status: 'error'})
        }
        else res.json({data: 'Такое объяление уже было удалено', status: 'error'});

    }catch(e){
        res.json({data: e, status: 'error'});
    }

})

//требует аунтефикации (обновление объявления) только владельцем
router.put('/:id',  isLoggedIn, fileMiddleware.array('images', 12), async (req,res)=>{

    const {id} = req.params;

    const {shortText, description, tags} = req.body;
    let images = []

    try {
        const isAuthor = await Advertisement.findOne({_id: id, isDeleted: false},{images: 1, userId: 1})
        if(isAuthor) {
            if (isAuthor.userId.toString() === req.user.id.toString()) {

                if (req.files.length) for (let i = 0; i < req.files.length; i++) images.push(req.files[i].path)

                else images = isAuthor.images


                await Advertisement.findByIdAndUpdate({_id: id}, {
                    shortText: shortText,
                    description: description,
                    images: images,
                    updatedAt: Date.now(),
                    tags: tags,
                });

                const result = await Advertisement.findOne({_id: id}, {isDeleted: 0, __v: 0}).populate('userId', 'name')

                res.json({data: result, status: 'OK'});

            } else res.json({data: 'Вы не можете обновить объяление, вы не его владелец', status: 'error'})
        }else res.json({data: 'Такое объяление было удалено', status: 'error'});
    } catch (e) {
        console.error(e);
        res.json({data: e, status: 'error'})
    }
})

module.exports = router
