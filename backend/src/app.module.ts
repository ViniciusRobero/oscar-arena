import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { EditionsModule } from './editions/editions.module'
import { FilmsModule } from './films/films.module'
import { CategoriesModule } from './categories/categories.module'
import { NominationsModule } from './nominations/nominations.module'
import { PredictionsModule } from './predictions/predictions.module'
import { ScoreModule } from './score/score.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EditionsModule,
    FilmsModule,
    CategoriesModule,
    NominationsModule,
    PredictionsModule,
    ScoreModule,
  ],
})
export class AppModule {}
