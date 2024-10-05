import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './Coffee';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Inverse relationship for coffees where the user is user_one
  @OneToMany(() => Coffee, (coffee) => coffee.userOne)
  coffees_one: Coffee[];

  // Inverse relationship for coffees where the user is user_two
  @OneToMany(() => Coffee, (coffee) => coffee.userTwo)
  coffees_two: Coffee[];
}
