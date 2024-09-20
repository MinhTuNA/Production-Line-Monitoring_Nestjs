import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
    })
    Name: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    PhoneNumber: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    Email: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
    })
    Role: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: true,
    })
    Pass: string;
}
