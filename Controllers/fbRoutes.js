module.exports = function(app, passport, mongooseUpd) {

    app.get('/',function(req,res){
		res.render('index.ejs'); // load the index.ejs file
    });
	
	app.get('/home', isLoggedIn, function(req,res){
		
		let cb = function(req, res, contentArrObj){
				res.render('home.ejs',{
				user	    : req.user,
				content  : contentArrObj });
			},
			projection = {
				'content_id':1,
				'student_id':1,
				'description':1
			}
		cbObj = {
				fn : cb,
				req: req,
				res: res,
			};
		mongooseUpd.getDoc(	{'student_id'	:	req.user._id},
							projection,
							'assignedcontent',
							cbObj);
		
	});
	//==========================
	//Handle content management
	//Next Steps: PUT, POST and delete interface for content
	app.get('content/:id', isLoggedIn,
	(req, res ) =>{
		let contentId = req.params.id,
			projection = {
			  "link":1,
              "description":1
			},
			cb = function(req, res, contentObj){
				res.render('content.ejs', {
					user     : req.user, // get the user out of session and pass to template
					content  : contentObj});
			},
			projection = {
				'content_id':1,
				'student_id':1,
				'description':1
			},
			cbObj = {
				fn : cb,
				req: req,
				res: res,
			};
			mongooseUpd.getDoc({'_id' : contentId },projection,'content',cbObj);			
		
	});
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email','user_friends'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect : '/'
        }),
		(req, res, next)=>{
			let query = { 'profile_id' : req.user.profile_id },
				doc = req.query;
			cbObj = {
				fn : (req,res,next)=>{
					next();
				},
				req: req,
				res: res,
				next: next,
			}
			mongooseUpd.populateDocs('studentFB',doc,query,cbObj);
		},
		(req,res)=>{
			res.redirect(req.session.returnTo || '/home');
			delete req.session.returnTo;
		});

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
	req.session.returnTo = req.path; 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth/facebook');
}