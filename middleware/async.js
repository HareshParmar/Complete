module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (err) {
            next(err);
        }
    };
}

// this function is used to replace try catch blocks from everywhere

// lets breakdown this code 

// router.get('/', async (req, res) => {
//     const genres = await Genre.find(); // .sort('name'); //.sort({name : 1})
//     res.status(200).send(genres);
// });

// here we have used an async( req, res) => {} function..  during run time express will make it an function and use it
// so what we are doing here is we are passing the using the middleware function and it will return the anonymous function back to router
// that way we will solve multi try and catch blocks with using it

// implemented in genre js file

// router.get('/', middlewareFunction(async (req, res) => {
//     const genres = await Genre.find(); // .sort('name'); //.sort({name : 1})
//     res.status(200).send(genres);
// }));
// however this is also time consuming to call it every where
