const d = require("../util/dockerApi")

const dockerHelper = {
    startImage: (imageName, startupParameters) => {
        const uploadsDir = process.env.UPLOADS_DIRECTORY || '/usr/uploads'

        d.api().then((api) => {
			api.createContainer({
				Image: imageName,
				Cmd: startupParameters,
				HostConfig: {
					NetworkMode: "sinae_express-mongo-network-sinae",
					AutoRemove: true,
					Binds: [`${uploadsDir}:/usr/uploads`],
				},
			})
            .then(function (container) {
                container.start().then((r) => {
                    console.log(startupParameters.join(" "))
                })
            })
            .catch(function (err) {
                console.log(err)				
            })
		})
    }

}


module.exports = dockerHelper