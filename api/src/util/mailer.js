const nodemailer = require("nodemailer")

const mailer = nodemailer.createTransport({
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.MAILER_USER,
		pass: process.env.MAILER_PASS,
	},
	tls: { rejectUnauthorized: false },
})

const resetPasswordTemplate = (user, url) => {
	const from = process.env.MAILER_USER
	const to = user.email
	const subject = "Redefinição de senha para SINAE"
	const html = `
    <p>Recebemos uma solicitação para redefinir a sua senha no sistema SINAE do LaBECFar</p>
    <p>Você pode usar o link abaixo para redefinir sua senha:</p>
    <a href="${url}">${url}</a>
    <p>Se você não usar esse link em 1 hora, o mesmo sera expirado.</p>
    <p>Se não foi você que fez essa solicitação, essa mensagem pode ser ignorada.</p>
    `
	return { from, to, subject, html }
}

module.exports = {
	mailer,
	resetPasswordTemplate,
}
