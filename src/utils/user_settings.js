class UserSettings {
    static instance;

    constructor(level = 0, individualOrHouseHold = 0, essentials = 0, debt = 0,
                discretionary = 0, savings = 0) {
        if (UserSettings.instance) {
            return UserSettings.instance;
        }
        this.level = level;
        this.individualOrHouseHold = individualOrHouseHold;
        this.essentials = essentials;
        this.debt = debt;
        this.discretionary = discretionary;
        this.savings = savings;

        UserSettings.instance = this;
    }
}

export const userSettings = new UserSettings();