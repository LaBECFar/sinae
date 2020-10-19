const d = require("../util/dockerApi")

const dockerHelper = {
    HostConfig: {
        NetworkMode: "sinae_express-mongo-network-sinae",
        AutoRemove: true,
        Binds: [`${process.env.UPLOADS_DIRECTORY || '/usr/uploads'}:/usr/uploads`],
    },

    runImage: (imageName, startupParameters) => {
        return new Promise((resolve) => {
            d.api().then((api) => {
                api.run(imageName, startupParameters, false, { HostConfig: dockerHelper.HostConfig}, function (err, data, container) {
                    resolve(data)
                })
            })
        })
    },

    startImage: (imageName, startupParameters) => {
        d.api().then((api) => {
			api.createContainer({
				Image: imageName,
				Cmd: startupParameters,
				HostConfig: dockerHelper.HostConfig
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