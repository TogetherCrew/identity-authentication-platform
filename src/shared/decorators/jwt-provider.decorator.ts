import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator'
import { decode } from 'jsonwebtoken'

export function JwtProvider(
    expectedProvider: string,
    validationOptions?: ValidationOptions
): PropertyDecorator {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'JwtProvider',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    try {
                        const decoded = decode(value)
                        if (decoded['provider'] === expectedProvider) {
                            return true
                        }
                        return false
                    } catch (error) {
                        return false
                    }
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} provider must be ${expectedProvider}.`
                },
            },
        })
    }
}
