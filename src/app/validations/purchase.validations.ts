import { enforce, omitWhen, only, staticSuite, test } from 'vest';
import { PurchaseFormModel } from '../models/purchaseFormModel';
import { SwapiService } from '../swapi.service';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';
import { ROOT_FORM } from 'ngx-vest-forms';

export const createPurchaseValidationSuite = (swapiService: SwapiService) => {
  return staticSuite((model: PurchaseFormModel, field?: string) => {
    if (field) {
      only(field);
    }
    test(ROOT_FORM, 'Brecht is not 30 anymore', () => {
      enforce(
        model.firstName === 'Brecht' &&
          model.lastName === 'Billiet' &&
          model.age === 30
      ).isFalsy();
    });

    omitWhen(!model.userId, () => {
      test('userId', 'userId is already taken', async ({ signal }) => {
        await lastValueFrom(
          swapiService
            .searchUserById(model.userId as string)
            .pipe(takeUntil(fromEvent(signal, 'abort')))
        ).then(
          () => Promise.reject(),
          () => Promise.resolve()
        );
      });
    });

    test('firstName', 'First name is required', () => {
      enforce(model.firstName).isNotBlank();
      enforce(model.firstName).isNotNull();
    });
    test('lastName', 'Last name is required', () => {
      enforce(model.lastName).isNotBlank();
      enforce(model.lastName).isNotNull();
    });
    test('age', 'Age is required', () => {
      enforce(model.age).isNotBlank();
      enforce(model.age).isNotNull();
    });
    omitWhen((model.age || 0) >= 18, () => {
      test('emergencyContact', 'Emergency contact is required', () => {
        enforce(model.emergencyContact).isNotBlank();
        enforce(model.emergencyContact).isNotNull();
      });
    });
    test('gender', 'Gender is required', () => {
      enforce(model.gender).isNotBlank();
      enforce(model.gender).isNotNull();
    });
    omitWhen(model.gender !== 'other', () => {
      test(
        'genderOther',
        'If gender is other, you have to specify the gender',
        () => {
          enforce(model.genderOther).isNotBlank();
        }
      );
    });
    test('productId', 'Product is required', () => {
      enforce(model.productId).isNotBlank();
      enforce(model.productId).isNotNull();
    });
    test('passwords.password', 'Password is not filled in', () => {
      enforce(model.passwords?.password).isNotBlank();
      enforce(model.passwords?.password).isNotNull();
    });
    omitWhen(!model.passwords?.password, () => {
      test(
        'passwords.confirmPassword',
        'Confirm password is not filled in',
        () => {
          enforce(model.passwords?.confirmPassword).isNotBlank();
          enforce(model.passwords?.confirmPassword).isNotNull();
        }
      );
    });
    omitWhen(
      !model.passwords?.password || !model.passwords?.confirmPassword,
      () => {
        test('passwords', 'Passwords do not match', () => {
          enforce(model.passwords?.confirmPassword).equals(
            model.passwords?.password
          );
        });
      }
    );
  });
};
