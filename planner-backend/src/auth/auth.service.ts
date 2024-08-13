import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'
import { verify } from 'argon2'
import { Response } from 'express'

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'
    constructor(
        private jwt: JwtService,
        private userService: UserService
    ) {}

    async login(dto: AuthDto) {
        const {password, ...user} = await this.validateUser(dto)
        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email)
        if (oldUser) throw new BadRequestException('User already exists')

        const {password, ...user} = await this.userService.create(dto)

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    private issueTokens(userId: string) {
        const data = { id: userId }
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return { accessToken, refreshToken }
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email)

        if (!user) throw new NotFoundException('User not found')
        
        const isValid = await verify(user.password, dto.password)

        if (!isValid) throw new NotFoundException('Wrong password')
        return user
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            expires: expiresIn,
            domain: 'localhost',
            sameSite: 'none',
            secure: true
        })
    }

    removeRefreshTokenFromResponse(res: Response) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            expires: new Date(0),
            domain: 'localhost',
            sameSite: 'none',
            secure: true
        })
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)
        if (!result) throw new NotFoundException('Refresh token not valid')
        
        const {password, ...user} = await this.userService.getById(result.id)

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }
}
