import {Prisma, UserDbo} from "@prisma/client";


// 1: Define a type that includes the relation to `Post`
const userWithRoles = Prisma.validator<Prisma.UserDboDefaultArgs>()({
    include: { user_roles: true },
})

// 3: This type will include a user and all their roles
export type UserWithPosts = Prisma.UserDboGetPayload<typeof userWithRoles>
