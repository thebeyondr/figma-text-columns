// This plugin is used to format text into columns

const __getParameterSuggestions = (key: string): string[] => {
    return {
        numColumns: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        spacing: [
            '8',
            '16',
            '24',
            '32',
            '40',
            '48',
            '56',
            '64',
            '72',
            '80',
            '88',
            '96',
            '104',
            '112',
            '120',
            '128',
            '136',
            '144',
            '152',
            '160',
            '168',
            '176',
            '184',
            '192',
            '200',
            '208',
            '216',
            '224',
            '232',
            '240',
            '248',
            '256',
        ],
        colWidth: [
            '120',
            '128',
            '136',
            '144',
            '152',
            '160',
            '168',
            '176',
            '184',
            '192',
            '200',
            '208',
            '216',
            '224',
            '232',
            '240',
            '248',
            '256',
        ],
    }[key];
};

const __loadFonts = async (textBox: TextNode): Promise<void> => {
    try {
        await Promise.all(
            textBox
                .getRangeAllFontNames(0, textBox.characters.length)
                .map(figma.loadFontAsync)
        );
    } catch (error) {
        console.log(error);
    }
};

const __formatParams = (
    textBox: TextNode,
    numColumns: string,
    spacing: string,
    colWidth: string
): {
    numColumns: number;
    spacing: number;
    textBox: {
        text: string;
        posX: number;
        posY: number;
        width: number;
        height: number;
        id: string;
    };
    colWidth: string | number;
} => {
    const parameters = {
        numColumns: parseInt(numColumns),
        spacing: parseInt(spacing),
        textBox: {
            // TODO: Add text sanitization
            text: textBox.characters,
            posX: textBox.x,
            posY: textBox.y,
            width: textBox.width,
            height: textBox.height,
            id: textBox.id,
            // styledSegments: textBox.getStyledTextSegments(['fontName']),
        },
        colWidth: colWidth ? parseInt(colWidth) : 'auto',
    };

    return parameters;
};

const generateTextNodes = async (
    formattedParams: any,
    columnFrame: FrameNode
) => {
    for (let i = 0; i < formattedParams.numColumns; i++) {
        let textNode = figma.createText();
        if (textNode.hasMissingFont) {
            return figma.closePlugin(
                'Please ensure the text box has a font and try again 😢'
            );
        }
        await __loadFonts(textNode);
        textNode.characters = formattedParams.textBox.text;
        columnFrame.appendChild(textNode);
    }
};

const runPlugin = (textBox: TextNode): void => {
    figma.parameters.on(
        'input',
        ({ key, query, result }: ParameterInputEvent) => {
            // TODO: Add 'px' to suggetions
            result.setSuggestions(
                __getParameterSuggestions(key).filter((s) => s.includes(query))
            );
        }
    );

    figma.on('run', ({ parameters }: RunEvent) => {
        if (parameters === undefined) {
            figma.closePlugin('Please enter parameters and try again 😢');
            return;
        }

        const { numColumns, spacing, colWidth } = parameters;
        if (!numColumns || !spacing) {
            figma.closePlugin('Please enter parameters and try again 😢');
            return;
        }

        const formattedParams = __formatParams(
            textBox,
            numColumns,
            spacing,
            colWidth
        );
        console.log(textBox);

        console.log(formattedParams);

        // TODO: Load fonts

        // TODO: Create auto-layout with spacing/column width
        let columnFrame = figma.createFrame();
        columnFrame.name = 'Columns';
        // Append the Meta card and place next to the node
        let node = figma.getNodeById(formattedParams.textBox.id) as SceneNode;
        figma.currentPage.appendChild(columnFrame);
        columnFrame.x = node.x;
        columnFrame.y = node.y + node.height + formattedParams.spacing;
        columnFrame.layoutMode = 'HORIZONTAL';
        columnFrame.itemSpacing = formattedParams.spacing;
        console.log(columnFrame);

        // TODO: Create text nodes
        generateTextNodes(formattedParams, columnFrame);

        // TODO: Place auto-layout frame at original coordinates
        // TODO: Highlight auto-layout frame
        figma.currentPage.selection = [columnFrame];
        // TODO: Zoom to auto-layout frame
        figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    });
};

const __checkSelection = (): void => {
    let numErrors: number = 0;
    const currentSelection = figma.currentPage.selection;

    if (currentSelection.length !== 1) {
        numErrors++;
    }

    if (currentSelection[0] && currentSelection[0].type !== 'TEXT') {
        numErrors++;
    }

    if (numErrors > 0) {
        figma.closePlugin('Select a text box and try again 😉');
        return;
    }

    const textNode = currentSelection[0] as TextNode;

    runPlugin(textNode);
};

__checkSelection();
