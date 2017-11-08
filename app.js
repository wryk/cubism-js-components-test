PIXI.loader
	.add('moc', 'hiyori/hiyori.moc3', { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
	.add('texture', 'hiyori/hiyori.png')
	.add('motion', 'hiyori/hiyori_m03.motion3.json', { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON })
	.load(main)

function main(loader, resources) {
	const moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(resources.moc.data)
	const texture = resources.texture.texture
	const animation = LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources.motion.data)

	// # STAGE
	const app = new PIXI.Application(1280, 720, { backgroundColor : 0x1099bb })
	document.body.appendChild(app.view)

	// build pixi model from cubism moc
	const model = new LIVE2DCUBISMPIXI.ModelBuilder()
		.setMoc(moc)
		.setTimeScale(1)
		.addTexture(0, resources.texture.texture)
		.addAnimatorLayer('base', LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1)
		.build()

	// add model to stage
	app.stage.addChild(model)
	app.stage.addChild(model.masks)

	// # Animation
	// play animation
	model.animator
		.getLayer('base')
		.play(animation)

	// # Ticker
	app.ticker.add((deltaTime) => {
		model.update(deltaTime)
		model.masks.update(app.renderer)
	})

	// # RESIZE
	const onResize = function (event = null) {
		const width = window.innerWidth * 0.8
		const height = (width / 16.0) * 9.0

		// resize view
		app.view.style.width = width + 'px'
		app.view.style.height = height + 'px'

		app.renderer.resize(width, height)


		// resize model
		model.position = new PIXI.Point((width * 0.5), (height * 0.5))
		model.scale = new PIXI.Point((model.position.x * 0.8), (model.position.x * 0.8))
		model.masks.resize(app.view.width, app.view.height)
	};

	onResize()
	window.onresize = onResize
}
