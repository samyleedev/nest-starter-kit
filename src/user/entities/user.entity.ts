import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Coffee } from '../../coffee/entities/coffee.entity';
import * as bcrypt from 'bcryptjs';
import { UUID } from 'crypto';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  roles: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Inverse relationship for coffees where the user is user_one
  @OneToMany(() => Coffee, (coffee) => coffee.userOne)
  coffees_one: Coffee[];

  // Inverse relationship for coffees where the user is user_two
  @OneToMany(() => Coffee, (coffee) => coffee.userTwo)
  coffees_two: Coffee[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
