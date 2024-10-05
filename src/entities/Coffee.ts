import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  location: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'time', default: '00:00:00' })
  start_time: string;

  @Column({ type: 'time', default: '23:59:59' })
  end_time: string;

  @Column()
  summary: string;

  @Column({ nullable: true })
  complete_note: string;

  @Column({ nullable: true })
  rating: number;

  @Column()
  user_one_id: number;

  @Column()
  user_two_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Many-to-one relationship with User for user_one_id
  @ManyToOne(() => User, (user) => user.coffees_one, { eager: true })
  @JoinColumn({ name: 'user_one_id' })
  userOne: User;

  // Many-to-one relationship with User for user_two_id
  @ManyToOne(() => User, (user) => user.coffees_two, { eager: true })
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;
}
